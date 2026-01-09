-- Create products table for seller product uploads
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product_media table to store image/video references
CREATE TABLE public.product_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for products

-- Sellers can view their own products
CREATE POLICY "Sellers can view their own products"
ON public.products
FOR SELECT
USING (auth.uid() = seller_id);

-- Sellers can insert their own products
CREATE POLICY "Sellers can insert their own products"
ON public.products
FOR INSERT
WITH CHECK (auth.uid() = seller_id AND has_role(auth.uid(), 'seller'));

-- Sellers can update their own products
CREATE POLICY "Sellers can update their own products"
ON public.products
FOR UPDATE
USING (auth.uid() = seller_id);

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete their own products"
ON public.products
FOR DELETE
USING (auth.uid() = seller_id);

-- Admins can view all products
CREATE POLICY "Admins can view all products"
ON public.products
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update all products (for approval)
CREATE POLICY "Admins can update all products"
ON public.products
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Buyers can view approved products only
CREATE POLICY "Buyers can view approved products"
ON public.products
FOR SELECT
USING (status = 'approved');

-- RLS policies for product_media

-- Sellers can manage their product media
CREATE POLICY "Sellers can view their product media"
ON public.product_media
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.products p 
  WHERE p.id = product_id AND p.seller_id = auth.uid()
));

CREATE POLICY "Sellers can insert their product media"
ON public.product_media
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.products p 
  WHERE p.id = product_id AND p.seller_id = auth.uid()
));

CREATE POLICY "Sellers can delete their product media"
ON public.product_media
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.products p 
  WHERE p.id = product_id AND p.seller_id = auth.uid()
));

-- Admins can view all product media
CREATE POLICY "Admins can view all product media"
ON public.product_media
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Public can view media for approved products
CREATE POLICY "Public can view approved product media"
ON public.product_media
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.products p 
  WHERE p.id = product_id AND p.status = 'approved'
));

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product media
INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true);

-- Storage policies for product media bucket
CREATE POLICY "Sellers can upload product media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-media' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view product media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-media');

CREATE POLICY "Sellers can delete their product media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'product-media' AND auth.uid()::text = (storage.foldername(name))[1]);