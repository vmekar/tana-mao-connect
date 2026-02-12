export type ListingStatus = 'active' | 'sold' | 'expired' | 'paused' | 'deleted';

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  userId: string;
  status: ListingStatus;
  isFeatured: boolean;
  createdAt: Date | string; // Allow both for compatibility
  updatedAt: Date | string;
}

export interface CreateListingDTO {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}
