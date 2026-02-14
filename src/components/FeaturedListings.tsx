import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ListingCard } from "./ListingCard";
import { listingService } from "@/services/listingService";
import { Listing } from "@/types/listing";
import { Map, Grid, List } from "lucide-react";
import { Button } from "./ui/button";
import { ListingsMap } from "./ListingsMap";

export const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

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
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Anúncios em Destaque
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          As melhores ofertas perto de você
        </p>

        {/* Toggle View */}
        <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Lista</span>
          </Button>
          <Button
            variant={viewMode === "map" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Mapa</span>
          </Button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
      ) : (
        <div className="h-[500px] w-full rounded-xl overflow-hidden border shadow-sm animate-in fade-in zoom-in-95 duration-500 relative z-0">
          <ListingsMap listings={listings} />
        </div>
      )}
    </section>
  );
};
