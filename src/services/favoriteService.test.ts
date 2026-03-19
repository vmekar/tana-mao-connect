import { describe, it, expect, vi, beforeEach } from 'vitest';
import { favoriteService } from './favoriteService';

describe('favoriteService', () => {
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

  describe('addFavorite', () => {
    it('should silently ignore 409 Conflict error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
      });

      await expect(favoriteService.addFavorite('user-1', 'listing-1')).resolves.not.toThrow();

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/favorites'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user-1', listing_id: 'listing-1' }),
      });
    });

    it('should throw other errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(favoriteService.addFavorite('user-1', 'listing-1')).rejects.toThrow('Failed to add favorite');
      expect(console.error).toHaveBeenCalled();
    });

    it('should successfully add favorite without errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      await expect(favoriteService.addFavorite('user-1', 'listing-1')).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/favorites'), expect.objectContaining({
        method: 'POST',
      }));
    });
  });
});
