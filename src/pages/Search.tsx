import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { listingService } from "@/services/listingService";
import { Listing, SearchFilters } from "@/types/listing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { SearchFilters as SearchFiltersComponent } from "@/components/SearchFilters";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse filters from URL
  const filters: SearchFilters = useMemo(() => ({
    query: searchParams.get("query") || undefined,
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    location: searchParams.get("location") || undefined,
  }), [searchParams]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const data = await listingService.searchListings(filters);
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (newFilters.query) params.set("query", newFilters.query);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.location) params.set("location", newFilters.location);

    setSearchParams(params);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Resultados para "{filters.query || "Todos os anúncios"}"
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <SearchFiltersComponent
              initialFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Results */}
          <section className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ) : (
              <div className="text-center py-16 bg-background rounded-lg border border-dashed">
                <h3 className="text-lg font-medium text-muted-foreground">
                  Nenhum anúncio encontrado com esses filtros.
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Tente remover alguns filtros ou buscar por outro termo.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
