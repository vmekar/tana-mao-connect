import { Listing, ListingStatus } from "@/types/listing";

const MOCK_FAVORITE_IDS = ["mock-listing-1"];
const MOCK_FAVORITE_LISTINGS: Listing[] = [
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
  }
];

export const favoriteService = {
  async fetchFavoriteIds(userId: string): Promise<string[]> {
    console.log(`Mock fetchFavoriteIds called for ${userId}`);
    return MOCK_FAVORITE_IDS;
  },

  async fetchFavoriteListings(userId: string): Promise<Listing[]> {
    console.log(`Mock fetchFavoriteListings called for ${userId}`);
    return MOCK_FAVORITE_LISTINGS;
  },

  async addFavorite(userId: string, listingId: string): Promise<void> {
    console.log(`Mock addFavorite called: userId ${userId}, listingId ${listingId}`);
    return Promise.resolve();
  },

  async removeFavorite(userId: string, listingId: string): Promise<void> {
    console.log(`Mock removeFavorite called: userId ${userId}, listingId ${listingId}`);
    return Promise.resolve();
  },
};
