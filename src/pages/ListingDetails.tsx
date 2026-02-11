import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Listing } from "@/types/listing";
import { listingService } from "@/services/listingService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Share2, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const data = await listingService.getById(id);
        if (!data) {
          toast.error("Anúncio não encontrado");
          navigate("/");
          return;
        }
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Erro ao carregar anúncio");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) return null;

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos atrás";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses atrás";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias atrás";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas atrás";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos atrás";
    return Math.floor(seconds) + " segundos atrás";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-video bg-muted rounded-xl overflow-hidden border">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm px-3 py-1">
                  ⭐ Destaque
                </Badge>
              )}
            </div>

            {/* Title and Price (Mobile only) */}
            <div className="lg:hidden space-y-2">
              <h1 className="text-2xl font-bold">{listing.title}</h1>
              <div className="text-3xl font-bold text-primary">
                R$ {listing.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
              <h2 className="text-xl font-semibold">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {listing.description || "O vendedor não forneceu uma descrição detalhada."}
              </p>
            </div>

            {/* Details Grid */}
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Detalhes</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Categoria</span>
                  <p className="font-medium">{listing.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Publicado em</span>
                  <p className="font-medium">{new Date(listing.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Localização</span>
                  <p className="font-medium">{listing.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Condição</span>
                  <p className="font-medium">Usado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Price and Action Card */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-elevated border sticky top-24">
              <div className="space-y-4">
                <div className="hidden lg:block space-y-2">
                  <h1 className="text-2xl font-bold leading-tight">{listing.title}</h1>
                  <div className="text-3xl font-bold text-primary">
                    R$ {listing.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="flex items-center text-muted-foreground text-sm gap-4 pb-4 border-b">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {timeAgo(listing.createdAt)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Heart className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>

                <Button variant="secondary" className="w-full" size="lg">
                   Comprar com Garantia
                </Button>

                {/* Seller Info (Mock) */}
                <div className="pt-4 border-t mt-4">
                  <h3 className="font-semibold mb-2">Informações do Vendedor</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      V
                    </div>
                    <div>
                      <p className="font-medium">Vendedor Teste</p>
                      <p className="text-xs text-muted-foreground">Na TanaMão desde 2023</p>
                    </div>
                  </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mt-4 text-sm text-blue-800 dark:text-blue-200">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    Dicas de Segurança
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs opacity-90">
                    <li>Não faça pagamentos antecipados.</li>
                    <li>Prefira locais públicos para entrega.</li>
                    <li>Verifique o produto antes de pagar.</li>
                  </ul>
                </div>

                <div className="flex justify-center pt-2">
                   <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar Anúncio
                   </Button>
                </div>
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
