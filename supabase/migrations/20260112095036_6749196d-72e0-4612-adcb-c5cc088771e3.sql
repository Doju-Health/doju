-- Create order status enum type
CREATE TYPE order_status AS ENUM ('confirmed', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered');

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  delivery_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  notes TEXT,
  status order_status NOT NULL DEFAULT 'confirmed',
  total_amount NUMERIC NOT NULL,
  shipping_amount NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'card',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  seller_id UUID NOT NULL,
  seller_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order status history for tracking timeline
CREATE TABLE public.order_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Orders RLS policies
-- Buyers can view their own orders
CREATE POLICY "Buyers can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = buyer_id);

-- Buyers can insert their own orders
CREATE POLICY "Buyers can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Sellers can view orders containing their products
CREATE POLICY "Sellers can view orders with their products"
ON public.orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.order_items oi
    WHERE oi.order_id = orders.id AND oi.seller_id = auth.uid()
  )
);

-- Sellers can update order status for their products
CREATE POLICY "Sellers can update orders with their products"
ON public.orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.order_items oi
    WHERE oi.order_id = orders.id AND oi.seller_id = auth.uid()
  )
);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all orders
CREATE POLICY "Admins can update all orders"
ON public.orders FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Order Items RLS policies
-- Buyers can view their order items
CREATE POLICY "Buyers can view their order items"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()
  )
);

-- Buyers can insert order items for their orders
CREATE POLICY "Buyers can insert order items"
ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()
  )
);

-- Sellers can view items they're selling
CREATE POLICY "Sellers can view their order items"
ON public.order_items FOR SELECT
USING (auth.uid() = seller_id);

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
ON public.order_items FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Order Status History RLS policies
-- Buyers can view their order history
CREATE POLICY "Buyers can view their order status history"
ON public.order_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_status_history.order_id AND o.buyer_id = auth.uid()
  )
);

-- Sellers can view and insert status history for their orders
CREATE POLICY "Sellers can view order status history"
ON public.order_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.order_items oi
    WHERE oi.order_id = order_status_history.order_id AND oi.seller_id = auth.uid()
  )
);

CREATE POLICY "Sellers can insert status history"
ON public.order_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.order_items oi
    WHERE oi.order_id = order_status_history.order_id AND oi.seller_id = auth.uid()
  )
);

-- Admins can manage all status history
CREATE POLICY "Admins can view all order status history"
ON public.order_status_history FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert order status history"
ON public.order_status_history FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger for orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;

-- Use REPLICA IDENTITY FULL for realtime updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_status_history REPLICA IDENTITY FULL;