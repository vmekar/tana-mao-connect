import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "@/services/favoriteService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: favoriteIds = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => (user ? favoriteService.fetchFavoriteIds(user.id) : Promise.resolve([])),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (listingId: string) => favoriteService.addFavorite(user!.id, listingId),
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', user?.id] });
      const previous = queryClient.getQueryData(['favorites', user?.id]);
      queryClient.setQueryData(['favorites', user?.id], (old: string[] = []) => [...old, listingId]);
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['favorites', user?.id], context?.previous);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar aos favoritos.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (listingId: string) => favoriteService.removeFavorite(user!.id, listingId),
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', user?.id] });
      const previous = queryClient.getQueryData(['favorites', user?.id]);
      queryClient.setQueryData(['favorites', user?.id], (old: string[] = []) => old.filter(id => id !== listingId));
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['favorites', user?.id], context?.previous);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover dos favoritos.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const toggleFavorite = (listingId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar favoritos.",
      });
      return;
    }

    if (favoriteIds.includes(listingId)) {
      removeMutation.mutate(listingId);
    } else {
      addMutation.mutate(listingId);
    }
  };

  return {
    favoriteIds,
    isLoading,
    toggleFavorite,
    isFavorite: (id: string) => favoriteIds.includes(id),
  };
};
