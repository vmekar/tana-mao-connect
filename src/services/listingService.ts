import { CreateListingDTO, Listing } from "@/types/listing";
import { supabase } from "@/integrations/supabase/client";

// Mock data to be used when backend is not available
const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "iPhone 14 Pro Max 256GB - Estado de Novo",
    description: "Aparelho impecável, sem marcas de uso. Acompanha caixa e todos os acessórios originais. Bateria 100%.",
    price: 4500,
    category: "Eletrônicos",
    location: "Pinheiros, SP",
    images: ["https://images.unsplash.com/photo-1678911820864-e5c3100957ae?w=800&q=80"],
    userId: "mock-user-1",
    status: 'active',
    isFeatured: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "MacBook Air M2 2023 - 8GB 256GB",
    description: "MacBook Air M2 Midnight. Apenas 10 ciclos de bateria. Garantia até Dez/2024.",
    price: 6800,
    category: "Informática",
    location: "Vila Madalena, SP",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
    userId: "mock-user-2",
    status: 'active',
    isFeatured: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Sofá 3 Lugares Retrátil - Cinza",
    description: "Sofá super confortável, retrátil e reclinável. Tecido Suede. Precisa retirar no local.",
    price: 1200,
    category: "Casa & Jardim",
    location: "Perdizes, SP",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
    userId: "mock-user-3",
    status: 'active',
    isFeatured: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Bicicleta Speed Caloi 10 - Aro 29",
    description: "Bike revisada, pneus novos. Ótima para iniciantes no ciclismo de estrada.",
    price: 850,
    category: "Esportes",
    location: "Jardins, SP",
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80"],
    userId: "mock-user-4",
    status: 'active',
    isFeatured: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "PlayStation 5 + 2 Controles + 3 Jogos",
    description: "Console PS5 versão com disco. Acompanha Spider-Man 2, God of War Ragnarok e FIFA 24.",
    price: 3200,
    category: "Eletrônicos",
    location: "Pinheiros, SP",
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80"],
    userId: "mock-user-5",
    status: 'active',
    isFeatured: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    title: "Mesa de Escritório com Gavetas - Madeira",
    description: "Mesa em L, madeira maciça. 1,60m x 1,40m. Gaveteiro com chave.",
    price: 450,
    category: "Móveis",
    location: "Vila Madalena, SP",
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80"],
    userId: "mock-user-6",
    status: 'active',
    isFeatured: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    title: "Smart TV 55' 4K Samsung QLED",
    description: "Modelo Q60B. Imagem espetacular. Sistema Tizen rápido. Controle solar.",
    price: 2800,
    category: "Eletrônicos",
    location: "Perdizes, SP",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80"],
    userId: "mock-user-7",
    status: 'active',
    isFeatured: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    title: "Câmera Canon EOS R6 + Lente 24-70mm",
    description: "Kit profissional. Câmera com 5k cliques. Lente sem fungos ou riscos.",
    price: 12500,
    category: "Eletrônicos",
    location: "Jardins, SP",
    images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80"],
    userId: "mock-user-8",
    status: 'active',
    isFeatured: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Set to true to force using mock data
const USE_MOCK_DATA = true;

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
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return MOCK_LISTINGS.filter((l) => l.status === 'active');
    }

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

    // Map DB fields to Listing interface
    return (data as any[]).map((item: ListingRow) => ({
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      price: item.price,
      category: item.category,
      location: item.location,
      images: item.images || [],
      userId: item.user_id,
      status: item.status as any,
      isFeatured: item.is_featured,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  },

  async fetchDetails(id: string): Promise<Listing | null> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_LISTINGS.find((l) => l.id === id) || null;
    }

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching listing details:', error);
      return null;
    }

    const item = data as any as ListingRow;

    return {
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      price: item.price,
      category: item.category,
      location: item.location,
      images: item.images || [],
      userId: item.user_id,
      status: item.status as any,
      isFeatured: item.is_featured,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  },

  async createListing(listing: CreateListingDTO): Promise<Listing> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newListing: Listing = {
        id: Math.random().toString(36).substr(2, 9),
        ...listing,
        userId: 'current-user-id', // In a real app, this comes from auth context
        status: 'active',
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_LISTINGS.unshift(newListing);
      return newListing;
    }

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

    const item = data as any as ListingRow;

    return {
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      price: item.price,
      category: item.category,
      location: item.location,
      images: item.images || [],
      userId: item.user_id,
      status: item.status as any,
      isFeatured: item.is_featured,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  },
};
