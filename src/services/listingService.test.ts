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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
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
});
