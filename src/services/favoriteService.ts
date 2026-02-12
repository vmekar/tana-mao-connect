import { supabase } from "@/integrations/supabase/client";
import { Listing, ListingStatus } from "@/types/listing";

// Mock store for favorites using localStorage to persist across reloads
// Fallback if backend table is missing
const getMockFavorites = (): Set<string> => {
  try {
    const stored = localStorage.getItem('mock_favorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveMockFavorites = (favorites: Set<string>) => {
  try {
    localStorage.setItem('mock_favorites', JSON.stringify(Array.from(favorites)));
  } catch (e) {
    console.warn("Failed to save mock favorites", e);
  }
};

export const favoriteService = {
  async fetchFavoriteIds(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', userId);

      if (error) {
        // Fallback to mock
        console.warn('Error fetching favorite IDs, using mock:', error);
        return Array.from(getMockFavorites());
      }

      return data.map((item) => item.listing_id);
    } catch (e) {
      console.warn('Exception fetching favorite IDs, using mock:', e);
      return Array.from(getMockFavorites());
    }
  },

  async fetchFavoriteListings(userId: string): Promise<Listing[]> {
    try {
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
    } catch (e) {
       console.error("Using mock for fetchFavoriteListings is not fully implemented due to missing listing data linkage, returning empty.", e);
       return [];
    }
  },

  async addFavorite(userId: string, listingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, listing_id: listingId });

      if (error) {
        if (error.code === '23505') return; // Duplicate
        throw error;
      }
    } catch (e) {
      console.warn("Supabase addFavorite failed, using mock", e);
      const favorites = getMockFavorites();
      favorites.add(listingId);
      saveMockFavorites(favorites);
    }
  },

  async removeFavorite(userId: string, listingId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('listing_id', listingId);

      if (error) throw error;
    } catch (e) {
      console.warn("Supabase removeFavorite failed, using mock", e);
      const favorites = getMockFavorites();
      favorites.delete(listingId);
      saveMockFavorites(favorites);
    }
  },
};
