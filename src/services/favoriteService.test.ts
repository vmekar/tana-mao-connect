import { describe, it, expect, vi, beforeEach } from 'vitest';
import { favoriteService } from './favoriteService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('favoriteService', () => {
  describe('addFavorite', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Suppress console.error in tests to keep output clean
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should silently ignore unique constraint error (23505)', async () => {
      // Setup mock
      const mockInsert = vi.fn().mockResolvedValue({
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      });
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // Execute & Verify it doesn't throw
      await expect(favoriteService.addFavorite('user-1', 'listing-1')).resolves.not.toThrow();

      // Verify the mock was called correctly
      expect(supabase.from).toHaveBeenCalledWith('favorites');
      expect(mockInsert).toHaveBeenCalledWith({ user_id: 'user-1', listing_id: 'listing-1' });
    });

    it('should throw other errors', async () => {
      // Setup mock
      const mockInsert = vi.fn().mockResolvedValue({
        error: { code: '500', message: 'Internal Server Error' },
      });
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // Execute & Verify it throws
      await expect(favoriteService.addFavorite('user-1', 'listing-1')).rejects.toThrow('Internal Server Error');

      // Verify the mock was called correctly
      expect(supabase.from).toHaveBeenCalledWith('favorites');
      expect(mockInsert).toHaveBeenCalledWith({ user_id: 'user-1', listing_id: 'listing-1' });
      expect(console.error).toHaveBeenCalled();
    });

    it('should successfully add favorite without errors', async () => {
      // Setup mock
      const mockInsert = vi.fn().mockResolvedValue({
        error: null,
      });
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // Execute & Verify it resolves
      await expect(favoriteService.addFavorite('user-1', 'listing-1')).resolves.toBeUndefined();

      // Verify the mock was called correctly
      expect(supabase.from).toHaveBeenCalledWith('favorites');
      expect(mockInsert).toHaveBeenCalledWith({ user_id: 'user-1', listing_id: 'listing-1' });
    });
  });
});
