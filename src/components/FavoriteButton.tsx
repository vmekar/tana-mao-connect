import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  variant?: "icon" | "outline" | "default" | "ghost";
}

export const FavoriteButton = ({ listingId, className, variant = "icon" }: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  const isFavorited = isFavorite(listingId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listingId);
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
      onClick={handleClick}
      disabled={isLoading}
    >
      <Heart
        className={cn("w-5 h-5", isFavorited && "fill-current")}
      />
      {variant !== "icon" && <span className="ml-2">{isFavorited ? "Salvo" : "Salvar"}</span>}
    </Button>
  );
};
