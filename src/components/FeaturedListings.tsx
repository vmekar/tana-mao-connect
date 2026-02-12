import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ListingCard } from "./ListingCard";
import { listingService } from "@/services/listingService";
import { Listing } from "@/types/listing";

export const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await listingService.fetchFeatured();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch featured listings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Anúncios em Destaque
        </h2>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16 bg-muted/30">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Anúncios em Destaque
      </h2>
      <p className="text-center text-muted-foreground mb-12">
        As melhores ofertas perto de você
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <Link key={listing.id} to={`/listing/${listing.id}`}>
            <ListingCard
              id={listing.id}
              title={listing.title}
              price={listing.price}
              image={listing.images[0] || "/placeholder.svg"}
              location={listing.location}
              timeAgo={formatDistanceToNow(new Date(listing.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
              isFeatured={listing.isFeatured}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
