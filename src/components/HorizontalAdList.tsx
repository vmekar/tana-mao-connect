import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdCard } from "./AdCard";
import { listingService } from "@/services/listingService";
import { Listing } from "@/types/listing";
import { Map, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { ListingsMap } from "./ListingsMap";

export const HorizontalAdList = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px tolerance
    }
  };

  useEffect(() => {
    handleScroll();
  }, [listings, viewMode]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 pt-4 pb-16 bg-muted/30">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col items-start text-left">
            <h2 className="text-2xl md:text-3xl font-heading font-black mb-1 text-foreground">
              Anúncios em Destaque
            </h2>
            <p className="text-muted-foreground text-sm">
              Encontre o que precisa perto de você
            </p>
          </div>
          {/* Toggle View Skeleton */}
          <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm w-[150px] h-10 opacity-50"></div>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 pt-4 pb-16 bg-muted/30">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col items-start text-left">
          <h2 className="text-2xl md:text-3xl font-heading font-black mb-1 text-foreground">
            Anúncios em Destaque
          </h2>
          <p className="text-muted-foreground text-sm">
            Encontre o que precisa perto de você
          </p>
        </div>

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
        <div className="relative group">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background border shadow-md p-2 rounded-full hidden md:flex items-center justify-center hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 pb-6 pt-2 snap-x snap-mandatory hide-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-smooth"
          >
            {listings.map((listing) => (
              <Link key={listing.id} to={`/listing/${listing.id}`} className="snap-start shrink-0 w-[280px] sm:w-[320px]">
                <AdCard
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

          {canScrollRight && listings.length > 0 && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background border shadow-md p-2 rounded-full hidden md:flex items-center justify-center hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          )}
        </div>
      ) : (
        <div className="h-[500px] w-full rounded-xl overflow-hidden border shadow-sm animate-in fade-in zoom-in-95 duration-500 relative z-0">
          <ListingsMap listings={listings} />
        </div>
      )}
    </section>
  );
};
