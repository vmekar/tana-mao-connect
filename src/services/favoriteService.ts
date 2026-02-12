import { supabase } from "@/integrations/supabase/client";
import { Listing, ListingStatus } from "@/types/listing";

export const favoriteService = {
  async fetchFavoriteIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorite IDs:', error);
      throw error;
    }

    return data.map((item) => item.listing_id);
  },

  async fetchFavoriteListings(userId: string): Promise<Listing[]> {
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorite listings:', error);
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((item) => {
      const listing = item.listings;
      return {
        id: listing.id,
        title: listing.title,
        description: listing.description || undefined,
        price: listing.price,
        category: listing.category,
        location: listing.location,
        images: listing.images || [],
        userId: listing.user_id,
        status: listing.status as ListingStatus,
        isFeatured: listing.is_featured,
        createdAt: listing.created_at,
        updatedAt: listing.updated_at,
      };
    });
  },

  async addFavorite(userId: string, listingId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, listing_id: listingId });

    if (error) {
      // Ignore unique constraint violation (already favorited)
      if (error.code === '23505') return;
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(userId: string, listingId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('listing_id', listingId);

    if (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },
};