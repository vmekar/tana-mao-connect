import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listingService } from './listingService';

describe('listingService', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ items: [] }),
    });
    global.fetch = mockFetch;
  });

  describe('createListing', () => {
    const mockListingDTO = {
      title: 'Test Listing',
      description: 'Test Description',
      price: 100,
      category: 'Test Category',
      subcategory: 'Test Subcategory',
      location: 'Test Location',
      bairro: 'Test Bairro',
      images: ['image1.jpg']
    };

    it('creates a listing successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          id: 'listing-123',
          ...mockListingDTO,
          user_id: 'mock-user-123',
          status: 'active',
          is_featured: false,
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
        }),
      });

      const result = await listingService.createListing(mockListingDTO);

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'POST',
      }));
      expect(result.id).toBe('listing-123');
      expect(result.title).toBe(mockListingDTO.title);
      expect(result.userId).toBe('mock-user-123');
    });

    it('throws an error if insertion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(listingService.createListing(mockListingDTO)).rejects.toThrow('Failed to create listing');
    });
  });

  describe('deleteListing', () => {
    it('deletes the listing successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      const listingId = 'listing-123';
      const imageUrls = ['https://example.com/storage/v1/object/public/listing-images/image1.jpg'];

      await expect(listingService.deleteListing(listingId, imageUrls)).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining(`/listings/${listingId}`), {
        method: 'DELETE',
      });
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
        subcategory: 'Test Subcategory',
        location: 'Test Location',
        bairro: 'Test Bairro',
        images: ['image1.jpg'],
        user_id: 'user-123',
        status: 'active',
        is_featured: true,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockListingRow),
      });

      const result = await listingService.fetchDetails('123');

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/listings/123'));

      expect(result).toEqual({
        id: '123',
        title: 'Test Listing',
        description: 'Test Description',
        price: 100,
        category: 'Test Category',
        subcategory: 'Test Subcategory',
        location: 'Test Location',
        bairro: 'Test Bairro',
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockListingRow),
      });

      const result = await listingService.fetchDetails('123');

      expect(result?.description).toBeUndefined();
    });

    it('returns null if response is 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await listingService.fetchDetails('123');

      expect(result).toBeNull();
    });
  });

  describe('searchListings', () => {
    it('applies default base query conditions without filters', async () => {
      await listingService.searchListings({});
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/listings/search?'));
    });

    it('applies query string filters', async () => {
      await listingService.searchListings({
        query: 'iPhone',
        location: 'São Paulo',
      });
      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('query=iPhone');
      expect(url).toContain('location=S%C3%A3o+Paulo');
    });

    it('applies array filters as joined strings', async () => {
      await listingService.searchListings({
        bairros: ['Centro', 'Jardins'],
      });
      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('bairros=Centro%2CJardins');
    });

    it('throws an error and logs it if the query fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(listingService.searchListings({})).rejects.toThrow('Failed to search listings');
    });
  });

  describe('updateListing', () => {
    const mockListingDto = {
      title: 'Updated Phone',
      description: 'Updated condition',
      price: 900,
      category: 'Eletrônicos',
      subcategory: 'Celulares',
      location: 'São Paulo',
      bairro: 'Centro',
      images: ['image1.jpg'],
    };

    it('successfully updates and returns the listing', async () => {
      const mockResponseData = {
        id: 'listing-123',
        title: mockListingDto.title,
        description: mockListingDto.description,
        price: mockListingDto.price,
        category: mockListingDto.category,
        subcategory: mockListingDto.subcategory,
        location: mockListingDto.location,
        bairro: mockListingDto.bairro,
        images: mockListingDto.images,
        user_id: 'mock-user-123',
        status: 'active',
        is_featured: false,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponseData),
      });

      const result = await listingService.updateListing('listing-123', mockListingDto);

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/listings/listing-123'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      });

      expect(result.id).toBe(mockResponseData.id);
      expect(result.userId).toBe(mockResponseData.user_id);
    });

    it('throws an error if the update operation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(listingService.updateListing('listing-123', mockListingDto)).rejects.toThrow('Failed to update listing');
    });
  });
});
