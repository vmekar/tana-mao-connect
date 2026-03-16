import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFavorites } from '../useFavorites';
import { useAuth } from '../useAuth';
import { useToast } from '../use-toast';
import { favoriteService } from '@/services/favoriteService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock dependencies
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../use-toast', () => ({
  useToast: vi.fn(),
}));

vi.mock('@/services/favoriteService', () => ({
  favoriteService: {
    fetchFavoriteIds: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

describe('useFavorites', () => {
  let queryClient: QueryClient;
  let mockToast: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup clean QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // disable retries to make tests faster
        },
      },
    });

    // Setup mock toast
    mockToast = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useToast).mockReturnValue({ toast: mockToast } as any);
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  describe('toggleFavorite', () => {
    it('should show toast "Login necessário" and not call service when user is unauthenticated', () => {
      // Mock unauthenticated state
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(useAuth).mockReturnValue({ user: null } as any);

      const { result } = renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      // Act
      act(() => {
        result.current.toggleFavorite('listing-1');
      });

      // Assert
      expect(mockToast).toHaveBeenCalledWith({
        title: "Login necessário",
        description: "Faça login para salvar favoritos.",
      });
      expect(favoriteService.addFavorite).not.toHaveBeenCalled();
      expect(favoriteService.removeFavorite).not.toHaveBeenCalled();
    });

    it('should add to favorites when listing is not favorited', async () => {
      // Mock authenticated state
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } } as any);

      // Mock service to return empty favorites list initially
      vi.mocked(favoriteService.fetchFavoriteIds).mockResolvedValue([]);

      const { result } = renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to resolve
      await act(async () => {
        // Just giving the query time to run
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Act
      act(() => {
        result.current.toggleFavorite('listing-1');
      });

      // Wait for mutation to be called
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // Assert
      expect(favoriteService.addFavorite).toHaveBeenCalledWith('user-1', 'listing-1');
      expect(favoriteService.removeFavorite).not.toHaveBeenCalled();
    });

    it('should remove from favorites when listing is already favorited', async () => {
      // Mock authenticated state
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } } as any);

      // Mock service to return a list that includes the listing
      vi.mocked(favoriteService.fetchFavoriteIds).mockResolvedValue(['listing-1']);

      // We need to set up the query client data manually to simulate successful initial fetch
      queryClient.setQueryData(['favorites', 'user-1'], ['listing-1']);

      const { result } = renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to resolve
      await act(async () => {
        // Just giving the query time to run
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Act
      act(() => {
        result.current.toggleFavorite('listing-1');
      });

      // Wait for mutation to be called
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // Assert
      expect(favoriteService.removeFavorite).toHaveBeenCalledWith('user-1', 'listing-1');
      expect(favoriteService.addFavorite).not.toHaveBeenCalled();
    });

    it('should revert cache and show toast when addFavorite fails', async () => {
      vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } } as any);
      vi.mocked(favoriteService.fetchFavoriteIds).mockResolvedValue([]);
      vi.mocked(favoriteService.addFavorite).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.toggleFavorite('listing-1');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar aos favoritos.",
      });
      // The cache should be empty
      expect(queryClient.getQueryData(['favorites', 'user-1'])).toEqual([]);
    });

    it('should revert cache and show toast when removeFavorite fails', async () => {
      vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } } as any);
      vi.mocked(favoriteService.fetchFavoriteIds).mockResolvedValue(['listing-1']);
      queryClient.setQueryData(['favorites', 'user-1'], ['listing-1']);
      vi.mocked(favoriteService.removeFavorite).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.toggleFavorite('listing-1');
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(mockToast).toHaveBeenCalledWith({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover dos favoritos.",
      });
      // The cache should be restored to contain listing-1
      expect(queryClient.getQueryData(['favorites', 'user-1'])).toEqual(['listing-1']);
    });
  });

  describe('isFavorite', () => {
    it('should return true if listing is in favorites', async () => {
      vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-1' } } as any);
      vi.mocked(favoriteService.fetchFavoriteIds).mockResolvedValue(['listing-1']);
      queryClient.setQueryData(['favorites', 'user-1'], ['listing-1', 'listing-2']);

      const { result } = renderHook(() => useFavorites(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // The component state comes from the query data which we mocked
      // In useFavorites, favoriteIds defaults to [] and is populated from useQuery
      expect(result.current.isFavorite('listing-1')).toBe(true);
      expect(result.current.isFavorite('listing-2')).toBe(false);
    });
  });
});
