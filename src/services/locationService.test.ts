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

  describe('fetchBairros', () => {
    it('returns an empty array if municipioId is not provided', async () => {
      const bairros = await locationService.fetchBairros(0);
      expect(bairros).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns deduplicated and sorted subdistritos names when subdistritos are available', async () => {
      const mockDistritos = [{ nome: 'Distrito A' }];
      const mockSubdistritos = [
        { nome: 'Centro' },
        { nome: 'Bairro B' },
        { nome: 'Centro' }, // Duplicate
        { nome: 'Bairro A' },
      ];

      vi.mocked(global.fetch).mockImplementation(async (input) => {
        const url = input.toString();
        if (url.includes('/distritos')) {
          return { ok: true, json: async () => mockDistritos } as Response;
        }
        if (url.includes('/subdistritos')) {
          return { ok: true, json: async () => mockSubdistritos } as Response;
        }
        return { ok: false } as Response;
      });

      const bairros = await locationService.fetchBairros(12345);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(bairros).toEqual(['Bairro A', 'Bairro B', 'Centro']);
    });

    it('returns deduplicated and sorted distritos names when subdistritos are empty', async () => {
      const mockDistritos = [
        { nome: 'Vila C' },
        { nome: 'Vila A' },
        { nome: 'Vila A' }, // Duplicate
        { nome: 'Vila B' },
      ];
      const mockSubdistritos: any[] = [];

      vi.mocked(global.fetch).mockImplementation(async (input) => {
        const url = input.toString();
        if (url.includes('/distritos')) {
          return { ok: true, json: async () => mockDistritos } as Response;
        }
        if (url.includes('/subdistritos')) {
          return { ok: true, json: async () => mockSubdistritos } as Response;
        }
        return { ok: false } as Response;
      });

      const bairros = await locationService.fetchBairros(12345);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(bairros).toEqual(['Vila A', 'Vila B', 'Vila C']);
    });

    it('returns an empty array when both endpoints fail', async () => {
      vi.mocked(global.fetch).mockImplementation(async () => {
        return { ok: false } as Response;
      });

      const bairros = await locationService.fetchBairros(12345);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(bairros).toEqual([]);
    });

    it('handles network error by returning an empty array and logging an error', async () => {
      const networkError = new Error('Network error');
      vi.mocked(global.fetch).mockRejectedValue(networkError);

      const bairros = await locationService.fetchBairros(12345);

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith('Error fetching bairros:', networkError);
      expect(bairros).toEqual([]);
    });
  });
});
