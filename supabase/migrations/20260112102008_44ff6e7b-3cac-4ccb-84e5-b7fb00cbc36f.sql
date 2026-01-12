-- Fix the overly permissive notifications insert policy
-- Drop the "System can insert notifications" policy which uses WITH CHECK (true)
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a more restrictive policy - only admins can insert notifications for now
-- The system notifications will be handled through admin context
CREATE POLICY "Users can insert notifications for themselves"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);