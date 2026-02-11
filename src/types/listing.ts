export type ListingStatus = 'active' | 'sold' | 'expired';

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
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingDTO {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
}
