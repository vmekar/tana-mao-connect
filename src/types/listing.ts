export type ListingStatus = 'active' | 'sold' | 'expired';

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  subcategory?: string;
  location: string;
  bairro?: string;
  images: string[];
  userId: string;
  status: ListingStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingDTO {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  location: string;
  bairro?: string;
  images: string[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bairros?: string[];
}
