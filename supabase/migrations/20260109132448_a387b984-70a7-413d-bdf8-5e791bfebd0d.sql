-- Add a restrictive policy that requires authentication for all SELECT operations on profiles
-- This ensures no anonymous users can read profile data
CREATE POLICY "Require authentication to view profiles" 
ON public.profiles 
FOR SELECT 
TO anon
USING (false);

-- Also add a policy for authenticated users to ensure only they can read profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));