import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listingService } from "@/services/listingService";
import { Listing } from "@/types/listing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, MapPin, Calendar } from "lucide-react";

const MyAds = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    const fetchListings = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await listingService.fetchUserListings(user.id);
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch user listings", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar seus anúncios.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, authLoading, navigate, toast]);

  const handleDelete = async (listing: Listing) => {
    setDeletingId(listing.id);
    try {
      await listingService.deleteListing(listing.id, listing.images);
      setListings(listings.filter((l) => l.id !== listing.id));
      toast({
        title: "Sucesso",
        description: "Anúncio excluído com sucesso.",
      });
    } catch (error) {
      console.error("Failed to delete listing", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o anúncio.",
      });
    } finally {
      setDeletingId(null);
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meus Anúncios</h1>
          <Button asChild>
            <Link to="/anunciar">Criar Novo Anúncio</Link>
          </Button>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16 bg-background rounded-xl border border-dashed">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">
              Você ainda não tem anúncios ativos.
            </h3>
            <Button asChild variant="outline">
              <Link to="/anunciar">Começar a vender agora</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-background rounded-xl shadow-sm border overflow-hidden flex flex-col group hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <img
                    src={listing.images[0] || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                    {listing.status === 'active' ? 'Ativo' : 'Inativo'}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {listing.category}
                    </span>
                  </div>

                  <Link to={`/listing/${listing.id}`} className="block">
                    <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors mb-1">
                      {listing.title}
                    </h3>
                  </Link>

                  <div className="text-xl font-bold text-foreground mb-4">
                    R$ {listing.price.toLocaleString('pt-BR')}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[100px]">{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex-1" disabled={deletingId === listing.id}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deletingId === listing.id ? 'Excluindo...' : 'Excluir'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O anúncio será permanentemente removido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(listing)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyAds;
