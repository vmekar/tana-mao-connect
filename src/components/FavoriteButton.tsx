import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { listingService } from "@/services/listingService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  variant?: "icon" | "outline" | "default" | "ghost";
}

export const FavoriteButton = ({ listingId, className, variant = "icon" }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      try {
        const status = await listingService.isFavorited(listingId);
        if (mounted) setIsFavorited(status);
      } catch (error) {
        console.error("Failed to check favorite status", error);
      }
    };
    checkStatus();
    return () => { mounted = false; };
  }, [listingId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    // Optimistic update
    const previousState = isFavorited;
    const newState = !previousState;
    setIsFavorited(newState);

    if (newState) {
      toast.success("Adicionado aos favoritos");
    } else {
      toast.info("Removido dos favoritos");
    }

    try {
      setLoading(true);
      await listingService.toggleFavorite(listingId);
    } catch (error) {
      // Revert on error
      setIsFavorited(previousState);
      toast.error("Erro ao atualizar favoritos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant === "icon" ? "ghost" : variant}
      size={variant === "icon" ? "icon" : "default"}
      className={cn(
        "transition-colors",
        isFavorited && "text-red-500 hover:text-red-600 hover:bg-red-50",
        className
      )}
      onClick={toggleFavorite}
      disabled={loading}
    >
      <Heart
        className={cn("w-5 h-5", isFavorited && "fill-current")}
      />
      {variant !== "icon" && <span className="ml-2">Salvar</span>}
    </Button>
  );
};
