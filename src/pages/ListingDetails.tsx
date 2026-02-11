import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listingService } from "@/services/listingService";
import { Listing } from "@/types/listing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageCircle, Share2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const data = await listingService.fetchDetails(id);
        setListing(data);
      } catch (error) {
        console.error("Failed to fetch listing", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar o anúncio.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, toast]);

  if (loading) {
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

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Anúncio não encontrado</h2>
          <Button asChild>
            <Link to="/">Voltar para Home</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/10 pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb / Back */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-background rounded-xl overflow-hidden shadow-sm border aspect-video relative">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    Destaque
                  </Badge>
                )}
              </div>

              {/* Title & Price (Mobile) */}
              <div className="lg:hidden bg-background p-6 rounded-xl shadow-sm border">
                <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                <div className="text-3xl font-bold text-primary mb-4">
                  R$ {listing.price.toLocaleString('pt-BR')}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Publicado há 2 horas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-background p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Descrição</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {listing.description || "Sem descrição."}
                </p>
              </div>

              {/* Details */}
              <div className="bg-background p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Detalhes</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Categoria</span>
                    <p className="font-medium">{listing.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Condição</span>
                    <p className="font-medium">Usado - Como novo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card (Desktop) */}
              <div className="hidden lg:block bg-background p-6 rounded-xl shadow-sm border sticky top-24">
                <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
                <div className="text-4xl font-bold text-primary mb-6">
                  R$ {listing.price.toLocaleString('pt-BR')}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Publicado em {new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full text-lg gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chat com Vendedor
                  </Button>
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <Share2 className="w-5 h-5" />
                    Compartilhar
                  </Button>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-background p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold mb-4">Informações do Vendedor</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    U
                  </div>
                  <div>
                    <p className="font-medium">Usuário Vendedor</p>
                    <p className="text-xs text-muted-foreground">Na plataforma desde 2023</p>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-primary hover:text-primary/80">
                  Ver perfil completo
                </Button>
              </div>

              {/* Safety Tips */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2">Dicas de Segurança</h3>
                <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
                  <li>Não faça pagamentos antecipados.</li>
                  <li>Prefira locais públicos para encontros.</li>
                  <li>Verifique o produto antes de pagar.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetails;
