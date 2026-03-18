import { CreateListingDTO, Listing, ListingStatus, SearchFilters } from "@/types/listing";

// Mock Data
const MOCK_LISTINGS: Listing[] = [
  {
    id: "mock-listing-1",
    title: "Mock Apartment",
    description: "A beautiful mock apartment in the center of the city.",
    price: 1500,
    category: "Real Estate",
    subcategory: "Apartment",
    location: "São Paulo, SP",
    bairro: "Centro",
    images: [],
    userId: "mock-user-123",
    status: "active",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mock-listing-2",
    title: "Mock Used Car",
    description: "In excellent condition.",
    price: 30000,
    category: "Vehicles",
    subcategory: "Cars",
    location: "Rio de Janeiro, RJ",
    bairro: "Copacabana",
    images: [],
    userId: "mock-user-456",
    status: "active",
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const listingService = {
  async fetchFeatured(): Promise<Listing[]> {
    return MOCK_LISTINGS.filter(l => l.isFeatured);
  },

  async fetchDetails(id: string): Promise<Listing | null> {
    return MOCK_LISTINGS.find(l => l.id === id) || MOCK_LISTINGS[0] || null;
  },

  async searchListings(filters: SearchFilters): Promise<Listing[]> {
    let results = MOCK_LISTINGS;

    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(l => l.title.toLowerCase().includes(q) || (l.description && l.description.toLowerCase().includes(q)));
    }

    if (filters.category) {
      results = results.filter(l => l.category === filters.category);
    }

    if (filters.subcategory) {
      results = results.filter(l => l.subcategory === filters.subcategory);
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter(l => l.location.toLowerCase().includes(loc));
    }

    if (filters.bairros && filters.bairros.length > 0) {
      results = results.filter(l => l.bairro && filters.bairros!.includes(l.bairro));
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(l => l.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(l => l.price <= filters.maxPrice!);
    }

    return results;
  },

  async fetchUserListings(userId: string): Promise<Listing[]> {
    // In a mock scenario, we might just return everything or filter if we want realism
    return MOCK_LISTINGS;
  },

  async uploadListingImage(file: File): Promise<string> {
    return URL.createObjectURL(file);
  },

  async deleteListing(id: string, imageUrls: string[]): Promise<void> {
    console.log(`Mock deleteListing called for ${id}`);
    return Promise.resolve();
  },

  async createListing(listing: CreateListingDTO): Promise<Listing> {
    console.log(`Mock createListing called for ${listing.title}`);
    return {
      id: `mock-listing-${Date.now()}`,
      title: listing.title,
      description: listing.description || undefined,
      price: listing.price,
      category: listing.category,
      subcategory: listing.subcategory || undefined,
      location: listing.location,
      bairro: listing.bairro || undefined,
      images: listing.images || [],
      userId: "mock-user-123",
      status: "active" as ListingStatus,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updateListing(id: string, listing: CreateListingDTO): Promise<Listing> {
    console.log(`Mock updateListing called for ${id}`);
    return {
      id: id,
      title: listing.title,
      description: listing.description || undefined,
      price: listing.price,
      category: listing.category,
      subcategory: listing.subcategory || undefined,
      location: listing.location,
      bairro: listing.bairro || undefined,
      images: listing.images || [],
      userId: "mock-user-123",
      status: "active" as ListingStatus,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};
