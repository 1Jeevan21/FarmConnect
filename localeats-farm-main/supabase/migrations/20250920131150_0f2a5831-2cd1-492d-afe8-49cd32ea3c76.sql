-- Clear all products from farmers table
UPDATE public.farmers 
SET products = '[]'::jsonb;