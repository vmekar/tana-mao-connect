export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  isFeatured: boolean;
  status: 'active' | 'sold' | 'paused' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type CreateListingDTO = Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'status' | 'isFeatured'>;
