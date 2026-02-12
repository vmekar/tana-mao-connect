/* eslint-disable @typescript-eslint/no-explicit-any */
import { Listing, CreateListingDTO } from "@/types/listing";
import { supabase } from "@/integrations/supabase/client";

// Mock data
const mockListings: Listing[] = [
  {
    id: "1",
    title: "iPhone 14 Pro Max 256GB - Estado de Novo",
    description: "Aparelho impecável, sem riscos. Acompanha caixa e carregador original. Saúde da bateria em 98%.",
    price: 4500,
    category: "Eletrônicos",
    location: "Pinheiros, SP",
    images: ["https://images.unsplash.com/photo-1678911820864-e5c3100957ae?w=800&q=80"],
    isFeatured: true,
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: "mock-user-1"
  },
  {
    id: "2",
    title: "MacBook Air M2 2023 - 8GB 256GB",
    description: "MacBook Air M2, cor Midnight. Pouco uso, apenas 15 ciclos de bateria. Garantia Apple até Dez/2025.",
    price: 6800,
    category: "Informática",
    location: "Vila Madalena, SP",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
    isFeatured: true,
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    userId: "mock-user-2"
  },
  {
    id: "3",
    title: "Sofá 3 Lugares Retrátil - Cinza",
    description: "Sofá super confortável, retrátil e reclinável. Tecido Suede cinza. Motivo da venda: mudança.",
    price: 1200,
    category: "Casa & Jardim",
    location: "Perdizes, SP",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
    isFeatured: false,
    status: 'active',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    userId: "mock-user-3"
  },
  {
    id: "4",
    title: "Bicicleta Speed Caloi 10 - Aro 29",
    description: "Bicicleta revisada recentemente. Pneus novos. Ótima para iniciantes no ciclismo de estrada.",
    price: 850,
    category: "Esportes",
    location: "Jardins, SP",
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80"],
    isFeatured: false,
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    userId: "mock-user-4"
  },
  {
    id: "5",
    title: "PlayStation 5 + 2 Controles + 3 Jogos",
    description: "PS5 versão com disco. Acompanha God of War Ragnarok, Spider-Man 2 e FIFA 24. Tudo funcionando perfeitamente.",
    price: 3200,
    category: "Eletrônicos",
    location: "Pinheiros, SP",
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80"],
    isFeatured: true,
    status: 'active',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    userId: "mock-user-1"
  },
  {
    id: "6",
    title: "Mesa de Escritório com Gavetas - Madeira",
    description: "Mesa robusta em madeira maciça. 3 gavetas espaçosas. Alguns detalhes de uso no tampo.",
    price: 450,
    category: "Casa & Jardim",
    location: "Vila Madalena, SP",
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80"],
    isFeatured: false,
    status: 'active',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    userId: "mock-user-5"
  },
  {
    id: "7",
    title: "Smart TV 55' 4K Samsung QLED",
    description: "TV com qualidade de imagem incrível. Sistema Tizen rápido. Controle remoto solar cell.",
    price: 2800,
    category: "Eletrônicos",
    location: "Perdizes, SP",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80"],
    isFeatured: false,
    status: 'active',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    userId: "mock-user-6"
  },
  {
    id: "8",
    title: "Câmera Canon EOS R6 + Lente 24-70mm",
    description: "Kit profissional. Câmera com menos de 10k cliques. Lente sem fungos ou riscos.",
    price: 12500,
    category: "Eletrônicos",
    location: "Jardins, SP",
    images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80"],
    isFeatured: false,
    status: 'active',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    userId: "mock-user-7"
  },
];

// In-memory store for new listings created in this session
const sessionListings: Listing[] = [...mockListings];

// Mock store for favorites using localStorage to persist across reloads
const getMockFavorites = (): Set<string> => {
  const stored = localStorage.getItem('mock_favorites');
  return stored ? new Set(JSON.parse(stored)) : new Set();
};

const saveMockFavorites = (favorites: Set<string>) => {
  localStorage.setItem('mock_favorites', JSON.stringify(Array.from(favorites)));
};

// Toggle to switch between Mock and Real API
const USE_MOCK_DATA = true;

export const listingService = {
  // Favorites methods
  toggleFavorite: async (listingId: string): Promise<boolean> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const favorites = getMockFavorites();
          if (favorites.has(listingId)) {
            favorites.delete(listingId);
            saveMockFavorites(favorites);
            resolve(false);
          } else {
            favorites.add(listingId);
            saveMockFavorites(favorites);
            resolve(true);
          }
        }, 200);
      });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if exists
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('listing_id', listingId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      return false;
    } else {
      await supabase
        .from('favorites')
        .insert({
          listing_id: listingId,
          user_id: user.id
        });
      return true;
    }
  },

  isFavorited: async (listingId: string): Promise<boolean> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const favorites = getMockFavorites();
          resolve(favorites.has(listingId));
        }, 100);
      });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('listing_id', listingId)
      .eq('user_id', user.id)
      .single();

    return !!data;
  },

  getFavorites: async (): Promise<Listing[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const favoritesSet = getMockFavorites();
          const favorites = sessionListings.filter(l => favoritesSet.has(l.id));
          resolve(favorites);
        }, 500);
      });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        listing_id,
        listings:listing_id (*)
      `)
      .eq('user_id', user.id);

    if (error) throw error;

    // Map nested listing data
    return data.map((item: any) => {
      const listing = item.listings;
      return {
        ...listing,
        isFeatured: listing.is_featured,
        createdAt: new Date(listing.created_at),
        updatedAt: new Date(listing.updated_at),
        userId: listing.user_id,
        images: listing.images || []
      };
    });
  },

  getFeatured: async (): Promise<Listing[]> => {
    if (USE_MOCK_DATA) {
      // Return top 4 or all? FeaturedListings usually shows 8
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(sessionListings);
        }, 500);
      });
    }

    // Use any cast to bypass type check for missing 'listings' table in generated types
    const { data, error } = await (supabase as any)
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw error;

    // Map Supabase response to Listing interface
    return data.map((item: any) => ({
      ...item,
      isFeatured: item.is_featured,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      userId: item.user_id,
      images: item.images || []
    }));
  },

  getById: async (id: string): Promise<Listing | null> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const listing = sessionListings.find(l => l.id === id);
          resolve(listing || null);
        }, 300);
      });
    }

    const { data, error } = await (supabase as any)
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;

    return {
      ...data,
      isFeatured: data.is_featured,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      userId: data.user_id,
      images: data.images || []
    };
  },

  create: async (listing: CreateListingDTO): Promise<Listing> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        const newListing: Listing = {
          ...listing,
          id: Math.random().toString(36).substr(2, 9),
          isFeatured: false,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'current-user-id' // Should ideally come from auth context
        };
        sessionListings.unshift(newListing); // Add to beginning
        setTimeout(() => {
          resolve(newListing);
        }, 800);
      });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await (supabase as any)
      .from('listings')
      .insert({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        location: listing.location,
        images: listing.images,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      isFeatured: data.is_featured,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      userId: data.user_id,
      images: data.images || []
    };
  }
};
