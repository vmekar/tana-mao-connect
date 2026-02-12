import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { favoriteService } from "@/services/favoriteService";
import { Listing } from "@/types/listing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart } from "lucide-react";

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    const fetchFavorites = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await favoriteService.fetchFavoriteListings(user.id);
        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorites", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar seus favoritos.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, authLoading, navigate, toast]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meus Favoritos</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-background rounded-xl border border-dashed">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-4">
              Você ainda não tem anúncios favoritos.
            </h3>
            <Button asChild variant="outline">
              <Link to="/search">Explorar anúncios</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((listing) => (
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
