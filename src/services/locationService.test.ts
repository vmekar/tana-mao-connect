import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { locationService } from './locationService';

const IBGE_API_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

describe('locationService', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchStates', () => {
    it('returns an array of states on successful fetch', async () => {
      const mockStates = [
        { id: 11, sigla: 'RO', nome: 'Rondônia' },
        { id: 12, sigla: 'AC', nome: 'Acre' },
      ];

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStates,
      } as Response);

      const states = await locationService.fetchStates();

      expect(global.fetch).toHaveBeenCalledWith(`${IBGE_API_BASE}/estados?orderBy=nome`);
      expect(states).toEqual(mockStates);
    });

    it('handles non-ok response by returning an empty array and logging an error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
      } as Response);

      const states = await locationService.fetchStates();

      expect(global.fetch).toHaveBeenCalledWith(`${IBGE_API_BASE}/estados?orderBy=nome`);
      expect(console.error).toHaveBeenCalledWith('Error fetching states:', new Error('Failed to fetch states'));
      expect(states).toEqual([]);
    });

    it('handles network error by returning an empty array and logging an error', async () => {
      const networkError = new Error('Network error');
      vi.mocked(global.fetch).mockRejectedValueOnce(networkError);

      const states = await locationService.fetchStates();

      expect(global.fetch).toHaveBeenCalledWith(`${IBGE_API_BASE}/estados?orderBy=nome`);
      expect(console.error).toHaveBeenCalledWith('Error fetching states:', networkError);
      expect(states).toEqual([]);
    });
  });
});
