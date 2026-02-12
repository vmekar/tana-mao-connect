import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ListingCard } from "./ListingCard";
import { listingService } from "@/services/listingService";
import { Listing } from "@/types/listing";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <section className="container mx-auto px-4 py-16 bg-muted/30">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Anúncios em Destaque
      </h2>
      <p className="text-center text-muted-foreground mb-12">
        As melhores ofertas perto de você
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
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
          ))}
        </div>
      )}
    </section>
  );
};
