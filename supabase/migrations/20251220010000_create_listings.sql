-- Create listings table
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired')),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Listings policies

-- Everyone can view active listings
CREATE POLICY "Public listings are viewable by everyone"
ON public.listings FOR SELECT
USING (status = 'active');

-- Users can insert their own listings
CREATE POLICY "Users can insert their own listings"
ON public.listings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update their own listings"
ON public.listings FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete their own listings"
ON public.listings FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updating timestamp
CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for search performance
CREATE INDEX listings_title_idx ON public.listings USING GIN (to_tsvector('portuguese', title));
CREATE INDEX listings_description_idx ON public.listings USING GIN (to_tsvector('portuguese', description));
CREATE INDEX listings_category_idx ON public.listings (category);
CREATE INDEX listings_location_idx ON public.listings (location);
CREATE INDEX listings_price_idx ON public.listings (price);
