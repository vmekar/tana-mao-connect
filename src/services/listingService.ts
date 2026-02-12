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

const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "iPhone 13 Pro Max - 256GB",
    description: "Aparelho em perfeito estado, sem riscos. Acompanha caixa e carregador original. Bateria em 92%.",
    price: 4500,
    category: "Eletrônicos",
    location: "São Paulo, SP",
    images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400"],
    userId: "user1",
    status: "active",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Apartamento 2 Quartos - Centro",
    description: "Lindo apartamento reformado, próximo ao metrô. Condomínio com lazer completo.",
    price: 350000,
    category: "Imóveis",
    location: "Rio de Janeiro, RJ",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400"],
    userId: "user2",
    status: "active",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "PlayStation 5 - Novo",
    description: "Console novo, lacrado, com nota fiscal e garantia de 1 ano. Versão com leitor de disco.",
    price: 3800,
    category: "Games",
    location: "Curitiba, PR",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400"],
    userId: "user3",
    status: "active",
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Sofá Retrátil 3 Lugares",
    description: "Sofá muito confortável, tecido suede, cor cinza. Pouco tempo de uso.",
    price: 1200,
    category: "Móveis",
    location: "Belo Horizonte, MG",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400"],
    userId: "user4",
    status: "active",
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const listingService = {
  async fetchFeatured(): Promise<Listing[]> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(8);

      if (error || !data || data.length === 0) {
        console.warn('Error fetching featured listings or empty, using mock:', error);
        return MOCK_LISTINGS.filter(l => l.isFeatured);
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
    } catch (e) {
      console.warn('Exception fetching featured listings, using mock:', e);
      return MOCK_LISTINGS.filter(l => l.isFeatured);
    }
  },

  async fetchDetails(id: string): Promise<Listing | null> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return MOCK_LISTINGS.find(l => l.id === id) || null;
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
    } catch {
       return MOCK_LISTINGS.find(l => l.id === id) || null;
    }
  },

  async searchListings(filters: SearchFilters): Promise<Listing[]> {
    try {
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
        console.error('Error searching listings, using mock:', error);
        return MOCK_LISTINGS.filter(l => {
           if (filters.query && !l.title.toLowerCase().includes(filters.query.toLowerCase())) return false;
           if (filters.category && l.category !== filters.category) return false;
           return true;
        });
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
    } catch {
        return MOCK_LISTINGS.filter(l => {
           if (filters.query && !l.title.toLowerCase().includes(filters.query.toLowerCase())) return false;
           if (filters.category && l.category !== filters.category) return false;
           return true;
        });
    }
  },

  async fetchUserListings(userId: string): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

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

  async updateListing(id: string, listing: CreateListingDTO): Promise<Listing> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('listings')
      .update({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        location: listing.location,
        images: listing.images,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the listing
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
