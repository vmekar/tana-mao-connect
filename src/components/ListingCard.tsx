import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  timeAgo: string;
  isFeatured?: boolean;
}

export const ListingCard = ({
  id,
  title,
  price,
  image,
  location,
  timeAgo,
  isFeatured,
}: ListingCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <div className="group relative bg-background rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
        />
      </button>

      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isFeatured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-none shadow-sm">
            Destaque
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
        
        <div className="mb-4">
          <span className="text-2xl font-bold text-foreground">
            R$ {price.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{location}</span>
          </div>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};
