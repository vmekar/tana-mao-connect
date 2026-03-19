import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messageService } from './messageService';

describe('messageService', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  describe('fetchInbox', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});

      mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ items: [] }),
      });
      global.fetch = mockFetch;
    });

    it('should successfully fetch and group messages by listingId', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ items: mockMessages }),
      });

      const result = await messageService.fetchInbox('receiver-id');

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/messages/inbox/receiver-id'));

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
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'Message with missing data',
          created_at: '2023-01-01T10:00:00Z',
          listing_id: 'listing-1',
          sender_id: 'user-1',
          listings: null,
          profiles: null,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ items: mockMessages }),
      });

      const result = await messageService.fetchInbox('receiver-id');

      expect(result).toHaveLength(1);
      expect(result[0].listingId).toBe('listing-1');
      expect(result[0].listingTitle).toBe('Anúncio indisponível');
      expect(result[0].messages).toHaveLength(1);
      expect(result[0].messages[0].senderName).toBe('Usuário');
    });

    it('should return empty array when no messages exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ items: [] }),
      });

      const result = await messageService.fetchInbox('receiver-id');
      expect(result).toEqual([]);
    });

    it('should throw an error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(messageService.fetchInbox('receiver-id')).rejects.toThrow('Failed to fetch inbox');
      expect(console.error).toHaveBeenCalled();
    });
  });
});
