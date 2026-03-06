import { supabase } from "@/integrations/supabase/client";

interface FavoriteRow {
  listing_id: string;
  listings: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string;
    location: string;
    images: string[] | null;
    user_id: string;
    status: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
  };
}

async function test() {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      listing_id,
      listings:listing_id (
        id,
        title,
        description,
        price,
        category,
        location,
        images,
        user_id,
        status,
        is_featured,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', '123')
    .order('created_at', { ascending: false });

  return (data as FavoriteRow[]).map((item) => item);
}
