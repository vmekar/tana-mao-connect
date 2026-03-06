import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messageService } from './messageService';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('messageService', () => {
  describe('fetchInbox', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Suppress console.error in tests to keep output clean
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should successfully fetch and group messages by listingId', async () => {
      // Mock data representing a typical Supabase join response
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'Hello listing 1',
          created_at: '2023-01-01T10:00:00Z',
          listing_id: 'listing-1',
          sender_id: 'user-1',
          listings: { title: 'Listing One Title' },
          profiles: { full_name: 'User One' },
        },
        {
          id: 'msg-2',
          content: 'Follow up listing 1',
          created_at: '2023-01-01T10:05:00Z',
          listing_id: 'listing-1',
          sender_id: 'user-2',
          listings: { title: 'Listing One Title' },
          profiles: { full_name: 'User Two' },
        },
        {
          id: 'msg-3',
          content: 'Hello listing 2',
          created_at: '2023-01-02T10:00:00Z',
          listing_id: 'listing-2',
          sender_id: 'user-1',
          listings: { title: 'Listing Two Title' },
          profiles: { full_name: 'User One' },
        },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockMessages, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await messageService.fetchInbox('receiver-id');

      expect(supabase.from).toHaveBeenCalledWith('messages');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('receiver_id', 'receiver-id');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });

      // Check grouping logic
      expect(result).toHaveLength(2);

      const listing1Group = result.find(g => g.listingId === 'listing-1');
      expect(listing1Group).toBeDefined();
      expect(listing1Group?.listingTitle).toBe('Listing One Title');
      expect(listing1Group?.messages).toHaveLength(2);
      expect(listing1Group?.messages[0].id).toBe('msg-1');
      expect(listing1Group?.messages[1].id).toBe('msg-2');

      const listing2Group = result.find(g => g.listingId === 'listing-2');
      expect(listing2Group).toBeDefined();
      expect(listing2Group?.listingTitle).toBe('Listing Two Title');
      expect(listing2Group?.messages).toHaveLength(1);
      expect(listing2Group?.messages[0].id).toBe('msg-3');
    });

    it('should handle missing relationships gracefully (null listings/profiles)', async () => {
      // Missing joined data
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'Message with missing data',
          created_at: '2023-01-01T10:00:00Z',
          listing_id: 'listing-1',
          sender_id: 'user-1',
          listings: null, // Listing deleted
          profiles: null, // Profile deleted
        },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockMessages, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await messageService.fetchInbox('receiver-id');

      expect(result).toHaveLength(1);
      expect(result[0].listingId).toBe('listing-1');
      expect(result[0].listingTitle).toBe('Anúncio indisponível'); // Fallback title
      expect(result[0].messages).toHaveLength(1);
      expect(result[0].messages[0].senderName).toBe('Usuário'); // Fallback name
    });

    it('should return empty array when no messages exist', async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await messageService.fetchInbox('receiver-id');

      expect(result).toEqual([]);
    });

    it('should throw an error when Supabase fetch fails', async () => {
      const mockError = new Error('Supabase fetch failed');
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      await expect(messageService.fetchInbox('receiver-id')).rejects.toThrow('Supabase fetch failed');
      expect(console.error).toHaveBeenCalledWith('Error fetching inbox:', mockError);
    });
  });
});
