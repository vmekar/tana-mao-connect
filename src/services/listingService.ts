import { CreateListingDTO, Listing, ListingStatus, SearchFilters } from "@/types/listing";
import { supabase } from "@/integrations/supabase/client";

interface ListingRow {
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
}

export const listingService = {
  async fetchFeatured(): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching featured listings:', error);
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((item: ListingRow) => ({
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
  },

  async fetchDetails(id: string): Promise<Listing | null> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching listing details:', error);
      return null;
    }

    const item = data as unknown as ListingRow;

    return {
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
    };
  },

  async searchListings(filters: SearchFilters): Promise<Listing[]> {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters.query) {
      query = query.ilike('title', `%${filters.query}%`);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching listings:', error);
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((item: ListingRow) => ({
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
  },

  async fetchUserListings(userId: string): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((item: ListingRow) => ({
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
  },

  async uploadListingImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteListing(id: string, imageUrls: string[]): Promise<void> {
    // Delete images from storage first
    if (imageUrls && imageUrls.length > 0) {
      const paths = imageUrls.map((url) => {
        const urlObj = new URL(url);
        // Path is typically /storage/v1/object/public/listing-images/<filename>
        const pathParts = urlObj.pathname.split('/');
        return pathParts[pathParts.length - 1]; // filename
      });

      const { error: storageError } = await supabase.storage
        .from('listing-images')
        .remove(paths);

      if (storageError) {
        console.error('Error deleting images:', storageError);
        // Continue to delete listing even if image deletion fails,
        // though ideally we'd want to handle this better.
      }
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  async createListing(listing: CreateListingDTO): Promise<Listing> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('listings')
      .insert({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        location: listing.location,
        images: listing.images,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    const item = data as unknown as ListingRow;

    return {
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
    };
  },
};
