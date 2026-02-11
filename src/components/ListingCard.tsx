import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

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
  isFeatured 
}: ListingCardProps) => {
  return (
    <Link to={`/listing/${id}`}>
    <Card className="group cursor-pointer overflow-hidden hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {isFeatured && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground font-semibold">
            ⭐ Destaque
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="text-2xl font-bold text-primary mb-3">
          R$ {price.toLocaleString('pt-BR')}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </Card>
    </Link>
  );
};
