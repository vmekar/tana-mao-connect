import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";

interface AdCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  timeAgo: string; // Used as date context for the prompt requirement
  isFeatured?: boolean;
}

export const AdCard = ({
  id,
  title,
  price,
  image,
  location,
  timeAgo,
  isFeatured,
}: AdCardProps) => {
  return (
    <Card className="group relative overflow-hidden rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-card h-full flex flex-col snap-start">
      <Link to={`/listing/${id}`} className="block h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isFeatured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-semibold shadow-sm">
              ⭐ Destaque
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
            {title}
          </h3>

          <div className="text-2xl font-bold text-primary mb-3">
            R$ {price.toLocaleString('pt-BR')}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="truncate max-w-[80px]" title={timeAgo}>{timeAgo}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite Button - Posicionado de forma absoluta por cima do card */}
      <div className="absolute top-3 right-3 z-20">
        <FavoriteButton listingId={id} className="bg-white/80 hover:bg-white text-muted-foreground shadow-sm backdrop-blur-sm" />
      </div>
    </Card>
  );
};