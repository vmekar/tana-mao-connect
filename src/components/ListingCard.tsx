import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";

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
  return (
    <div className="group relative bg-background rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      {/* Favorite Button */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton listingId={id} className="bg-white/80 hover:bg-white text-gray-600 shadow-sm backdrop-blur-sm" />
      </div>

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
