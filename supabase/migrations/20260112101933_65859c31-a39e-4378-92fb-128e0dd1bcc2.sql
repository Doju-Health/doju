-- Create conversation type enum
CREATE TYPE conversation_type AS ENUM ('admin_direct', 'support');

-- Create message status enum
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- Create document type enum
CREATE TYPE document_type AS ENUM ('government_id', 'proof_of_address', 'vehicle_document', 'business_document', 'product_document', 'other');

-- Create document status enum
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type conversation_type NOT NULL,
  participant_ids UUID[] NOT NULL,
  subject TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view conversations they are part of"
ON public.conversations FOR SELECT
USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Admins can view all conversations"
ON public.conversations FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create support conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.uid() = ANY(participant_ids) AND type = 'support');

CREATE POLICY "Admins can create any conversations"
ON public.conversations FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Participants can update conversations"
ON public.conversations FOR UPDATE
USING (auth.uid() = ANY(participant_ids) OR has_role(auth.uid(), 'admin'::app_role));

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  status message_status NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (auth.uid() = ANY(c.participant_ids) OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Users can send messages to their conversations"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
    AND (auth.uid() = ANY(c.participant_ids) OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Admins can send messages"
ON public.messages FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = sender_id);

-- Create user_documents table for centralized document management
CREATE TABLE public.user_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  document_type document_type NOT NULL,
  document_url TEXT NOT NULL,
  document_name TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_documents
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- User documents policies
CREATE POLICY "Users can view their own documents"
ON public.user_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
ON public.user_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents"
ON public.user_documents FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all documents"
ON public.user_documents FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at triggers
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_documents_updated_at
BEFORE UPDATE ON public.user_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;