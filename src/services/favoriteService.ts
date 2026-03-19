import { Listing, ListingStatus } from "@/types/listing";

const API_URL = import.meta.env.VITE_API_URL || '';

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

export const favoriteService = {
  async fetchFavoriteIds(userId: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_URL}/favorites/${userId}/ids`);
      if (!response.ok) throw new Error('Failed to fetch favorite IDs');

      const data = await response.json();
      const items: { listing_id: string }[] = data.items || [];
      return items.map((item) => item.listing_id);
    } catch (error) {
      console.error('Error fetching favorite IDs:', error);
      throw error;
    }
  },

  async fetchFavoriteListings(userId: string): Promise<Listing[]> {
    try {
      const response = await fetch(`${API_URL}/favorites/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch favorite listings');

      const data = await response.json();
      const items: FavoriteRow[] = data.items || [];

      return items.map((item) => {
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
    } catch (error) {
      console.error('Error fetching favorite listings:', error);
      throw error;
    }
  },

  async addFavorite(userId: string, listingId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, listing_id: listingId }),
      });

      if (!response.ok) {
        // In a real API we might check for a 409 Conflict if already favorited
        if (response.status === 409) return;
        throw new Error('Failed to add favorite');
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(userId: string, listingId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/favorites/${userId}/${listingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove favorite');
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },
};