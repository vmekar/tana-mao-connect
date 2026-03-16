import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listingService } from './listingService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
    auth: {
      getUser: vi.fn(),
    }
  },
}));

describe('listingService', () => {
  // Define a reusable query builder mock
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    then: vi.fn((resolve) => resolve({ data: [], error: null })),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Reset the then implementation to a default success state for each test
    mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: [], error: null }));

    // Default mock for from() returning our query builder
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(supabase.from).mockReturnValue(mockQueryBuilder as any);
  });

  describe('deleteListing', () => {
    it('logs an error when storage deletion fails but continues to delete the listing', async () => {
      // Setup mock for storage deletion failure
      const mockStorageRemove = vi.fn().mockResolvedValue({
        error: { message: 'Storage error' },
      });
      vi.mocked(supabase.storage.from).mockReturnValue({
        remove: mockStorageRemove,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // Setup mock for listing deletion success
      const mockEq = vi.fn().mockResolvedValue({
        error: null,
      });
      const mockDelete = vi.fn().mockReturnValue({
        eq: mockEq,
      });
      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const listingId = 'listing-123';
      const imageUrls = ['https://example.com/storage/v1/object/public/listing-images/image1.jpg'];

      // Execute
      await expect(listingService.deleteListing(listingId, imageUrls)).resolves.toBeUndefined();

      // Verify storage deletion was attempted
      expect(supabase.storage.from).toHaveBeenCalledWith('listing-images');
      expect(mockStorageRemove).toHaveBeenCalledWith(['image1.jpg']);

      // Verify console.error was called
      expect(console.error).toHaveBeenCalledWith('Error deleting images:', { message: 'Storage error' });

      // Verify listing deletion was still executed
      expect(supabase.from).toHaveBeenCalledWith('listings');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', listingId);
    });
  });
  describe('fetchDetails', () => {
    it('successfully fetches and maps database snake_case fields to camelCase Listing interface', async () => {
      const mockListingRow = {
        id: '123',
        title: 'Test Listing',
        description: 'Test Description',
        price: 100,
        category: 'Test Category',
        location: 'Test Location',
        images: ['image1.jpg'],
        user_id: 'user-123',
        status: 'active',
        is_featured: true,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      };

      mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: mockListingRow, error: null }));

      const result = await listingService.fetchDetails('123');

      expect(supabase.from).toHaveBeenCalledWith('listings');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('id, title, description, price, category, subcategory, location, bairro, images, user_id, status, is_featured, created_at, updated_at');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', '123');
      expect(mockQueryBuilder.single).toHaveBeenCalled();

      expect(result).toEqual({
        id: '123',
        title: 'Test Listing',
        description: 'Test Description',
        price: 100,
        category: 'Test Category',
        location: 'Test Location',
        images: ['image1.jpg'],
        userId: 'user-123',
        status: 'active',
        isFeatured: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      });
    });

    it('maps null description to undefined', async () => {
      const mockListingRow = {
        id: '123',
        title: 'Test Listing',
        description: null, // Null from DB
        price: 100,
        category: 'Test Category',
        location: 'Test Location',
        images: ['image1.jpg'],
        user_id: 'user-123',
        status: 'active',
        is_featured: false,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      };

      mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: mockListingRow, error: null }));

      const result = await listingService.fetchDetails('123');

      expect(result?.description).toBeUndefined();
    });

    it('maps null images to an empty array', async () => {
      const mockListingRow = {
        id: '123',
        title: 'Test Listing',
        description: 'Test Description',
        price: 100,
        category: 'Test Category',
        location: 'Test Location',
        images: null, // Null from DB
        user_id: 'user-123',
        status: 'active',
        is_featured: false,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      };

      mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: mockListingRow, error: null }));

      const result = await listingService.fetchDetails('123');

      expect(result?.images).toEqual([]);
    });

    it('returns null and logs error if database query fails', async () => {
      const mockError = { message: 'Database query failed' };
      mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: null, error: mockError }));

      const result = await listingService.fetchDetails('123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith('Error fetching listing details:', mockError);
    });
  });

  describe('searchListings', () => {
    it('applies default base query conditions without filters', async () => {
      await listingService.searchListings({});

      expect(supabase.from).toHaveBeenCalledWith('listings');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('id, title, description, price, category, subcategory, location, bairro, images, user_id, status, is_featured, created_at, updated_at');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('status', 'active');
      expect(mockQueryBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false });

      // Should not call specific filters
      expect(mockQueryBuilder.ilike).not.toHaveBeenCalled();
      expect(mockQueryBuilder.in).not.toHaveBeenCalled();
      expect(mockQueryBuilder.gte).not.toHaveBeenCalled();
      expect(mockQueryBuilder.lte).not.toHaveBeenCalled();
    });

    it('applies ilike for query and location filters', async () => {
      await listingService.searchListings({
        query: 'iPhone',
        location: 'São Paulo',
      });

      expect(mockQueryBuilder.ilike).toHaveBeenCalledWith('title', '%iPhone%');
      expect(mockQueryBuilder.ilike).toHaveBeenCalledWith('location', '%São Paulo%');
    });

    it('applies eq for category and subcategory filters', async () => {
      await listingService.searchListings({
        category: 'Eletrônicos',
        subcategory: 'Celulares',
      });

      // Includes 'status' from default base condition
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('status', 'active');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('category', 'Eletrônicos');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('subcategory', 'Celulares');
    });

    it('applies in for bairros filter when provided with an array of values', async () => {
      await listingService.searchListings({
        bairros: ['Centro', 'Jardins', 'Pinheiros'],
      });

      expect(mockQueryBuilder.in).toHaveBeenCalledWith('bairro', ['Centro', 'Jardins', 'Pinheiros']);
    });

    it('does not apply in for bairros filter when array is empty', async () => {
      await listingService.searchListings({
        bairros: [],
      });

      expect(mockQueryBuilder.in).not.toHaveBeenCalled();
    });

    it('applies gte and lte for minPrice and maxPrice filters', async () => {
      await listingService.searchListings({
        minPrice: 100,
        maxPrice: 500,
      });

      expect(mockQueryBuilder.gte).toHaveBeenCalledWith('price', 100);
      expect(mockQueryBuilder.lte).toHaveBeenCalledWith('price', 500);
    });

    it('applies 0 value for price ranges correctly', async () => {
      await listingService.searchListings({
        minPrice: 0,
        maxPrice: 0,
      });

      expect(mockQueryBuilder.gte).toHaveBeenCalledWith('price', 0);
      expect(mockQueryBuilder.lte).toHaveBeenCalledWith('price', 0);
    });

    it('throws an error and logs it if the query fails', async () => {
      const mockError = { message: 'Database error' };
      mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: null, error: mockError }));

      await expect(listingService.searchListings({})).rejects.toEqual(mockError);

      expect(console.error).toHaveBeenCalledWith('Error searching listings:', mockError);
    });
  });
});
