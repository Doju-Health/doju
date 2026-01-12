-- Create dispatch agent status enum
CREATE TYPE dispatch_agent_status AS ENUM ('pending_verification', 'active', 'suspended', 'rejected');

-- Create vehicle type enum
CREATE TYPE vehicle_type AS ENUM ('bike', 'car', 'van');

-- Create dispatch agents table
CREATE TABLE public.dispatch_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  home_address TEXT NOT NULL,
  area_of_operation TEXT NOT NULL,
  vehicle_type vehicle_type NOT NULL,
  plate_number TEXT NOT NULL,
  government_id_url TEXT NOT NULL,
  selfie_url TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  status dispatch_agent_status NOT NULL DEFAULT 'pending_verification',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on dispatch_agents
ALTER TABLE public.dispatch_agents ENABLE ROW LEVEL SECURITY;

-- RLS policies for dispatch agents

-- Users can view their own dispatch agent profile
CREATE POLICY "Users can view their own dispatch agent profile"
ON public.dispatch_agents FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own dispatch agent profile
CREATE POLICY "Users can insert their own dispatch agent profile"
ON public.dispatch_agents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own dispatch agent profile (limited fields)
CREATE POLICY "Users can update their own dispatch agent profile"
ON public.dispatch_agents FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all dispatch agent profiles
CREATE POLICY "Admins can view all dispatch agent profiles"
ON public.dispatch_agents FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all dispatch agent profiles
CREATE POLICY "Admins can update all dispatch agent profiles"
ON public.dispatch_agents FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_dispatch_agents_updated_at
BEFORE UPDATE ON public.dispatch_agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add dispatch role to app_role enum if not exists (ALTER TYPE to add value)
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'dispatch';

-- Create storage bucket for dispatch agent documents
INSERT INTO storage.buckets (id, name, public) VALUES ('dispatch-documents', 'dispatch-documents', false);

-- Storage policies for dispatch documents
-- Authenticated users can upload to their own folder
CREATE POLICY "Users can upload their dispatch documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dispatch-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own documents
CREATE POLICY "Users can view their own dispatch documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'dispatch-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all dispatch documents
CREATE POLICY "Admins can view all dispatch documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'dispatch-documents' AND has_role(auth.uid(), 'admin'::app_role));

-- Add assigned_dispatch_agent_id to orders for future use (nullable, no constraint yet)
ALTER TABLE public.orders ADD COLUMN assigned_dispatch_agent_id UUID REFERENCES public.dispatch_agents(id);

-- Enable realtime for dispatch agents table
ALTER PUBLICATION supabase_realtime ADD TABLE public.dispatch_agents;
ALTER TABLE public.dispatch_agents REPLICA IDENTITY FULL;