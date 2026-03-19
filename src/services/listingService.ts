import { CreateListingDTO, Listing, ListingStatus, SearchFilters } from "@/types/listing";

interface ListingRow {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  subcategory?: string;
  location: string;
  bairro?: string;
  images: string[] | null;
  user_id: string;
  status: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const listingService = {
  async fetchFeatured(): Promise<Listing[]> {
    try {
      const response = await fetch(`${API_URL}/listings/featured`);
      if (!response.ok) throw new Error('Failed to fetch featured listings');

      const data = await response.json();
      const items: ListingRow[] = data.items || [];

      return items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        price: item.price,
        category: item.category,
        subcategory: item.subcategory || undefined,
        location: item.location,
        bairro: item.bairro || undefined,
        images: item.images || [],
        userId: item.user_id,
        status: item.status as ListingStatus,
        isFeatured: item.is_featured,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      throw error;
    }
  },

  async fetchDetails(id: string): Promise<Listing | null> {
    try {
      const response = await fetch(`${API_URL}/listings/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch listing details');
      }

      const item: ListingRow = await response.json();

      return {
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        price: item.price,
        category: item.category,
        subcategory: item.subcategory || undefined,
        location: item.location,
        bairro: item.bairro || undefined,
        images: item.images || [],
        userId: item.user_id,
        status: item.status as ListingStatus,
        isFeatured: item.is_featured,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    } catch (error) {
      console.error('Error fetching listing details:', error);
      return null;
    }
  },

  async searchListings(filters: SearchFilters): Promise<Listing[]> {
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('query', filters.query);
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.location) params.append('location', filters.location);
      if (filters.bairros && filters.bairros.length > 0) {
        params.append('bairros', filters.bairros.join(','));
      }
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

      const response = await fetch(`${API_URL}/listings/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to search listings');

      const data = await response.json();
      const items: ListingRow[] = data.items || [];

      return items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        price: item.price,
        category: item.category,
        location: item.location,
        images: item.images || [],
        userId: item.user_id,
        status: item.status as ListingStatus,
        isFeatured: item.is_featured,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error searching listings:', error);
      throw error;
    }
  },

  async fetchUserListings(userId: string): Promise<Listing[]> {
    try {
      const response = await fetch(`${API_URL}/listings/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user listings');

      const data = await response.json();
      const items: ListingRow[] = data.items || [];

      return items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        price: item.price,
        category: item.category,
        location: item.location,
        images: item.images || [],
        userId: item.user_id,
        status: item.status as ListingStatus,
        isFeatured: item.is_featured,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }
  },

  async uploadListingImage(file: File): Promise<string> {
    // In a real implementation this would upload the file to your backend
    // and return the new URL. Since there's no supabase anymore, we'll
    // simulate a successful upload returning a dummy URL.
    return URL.createObjectURL(file);
  },

  async deleteListing(id: string, imageUrls: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/listings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete listing');
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  async createListing(listing: CreateListingDTO): Promise<Listing> {
    try {
      const response = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...listing,
          user_id: 'mock-user-123', // Static mock user ID
        }),
      });

      if (!response.ok) throw new Error('Failed to create listing');

      const item: ListingRow = await response.json();

      return {
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        price: item.price,
        category: item.category,
        subcategory: item.subcategory || undefined,
        location: item.location,
        bairro: item.bairro || undefined,
        images: item.images || [],
        userId: item.user_id,
        status: item.status as ListingStatus,
        isFeatured: item.is_featured,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  async updateListing(id: string, listing: CreateListingDTO): Promise<Listing> {
    try {
      const response = await fetch(`${API_URL}/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...listing,
          user_id: 'mock-user-123', // Static mock user ID
        }),
      });

      if (!response.ok) throw new Error('Failed to update listing');

      const item: ListingRow = await response.json();

      return {
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        price: item.price,
        category: item.category,
        subcategory: item.subcategory || undefined,
        location: item.location,
        bairro: item.bairro || undefined,
        images: item.images || [],
        userId: item.user_id,
        status: item.status as ListingStatus,
        isFeatured: item.is_featured,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },
};