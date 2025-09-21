-- Add foreign key relationship between farmers and profiles tables
ALTER TABLE public.farmers 
ADD CONSTRAINT farmers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;