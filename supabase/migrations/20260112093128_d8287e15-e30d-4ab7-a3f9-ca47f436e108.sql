-- Allow users to insert their own seller role during onboarding
CREATE POLICY "Users can insert seller role during onboarding"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id AND role = 'seller');