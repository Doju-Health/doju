-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Buyers can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Buyers can insert order items" ON public.order_items;

-- Create new policies that don't cause recursion
-- For viewing: buyers can see order items where they own the order (using a subquery with SECURITY DEFINER function)
CREATE OR REPLACE FUNCTION public.get_order_buyer_id(order_uuid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT buyer_id FROM orders WHERE id = order_uuid;
$$;

-- Recreate policies using the security definer function to break recursion
CREATE POLICY "Buyers can view their order items"
ON public.order_items
FOR SELECT
USING (
  public.get_order_buyer_id(order_id) = auth.uid()
);

CREATE POLICY "Buyers can insert order items"
ON public.order_items
FOR INSERT
WITH CHECK (
  public.get_order_buyer_id(order_id) = auth.uid()
);