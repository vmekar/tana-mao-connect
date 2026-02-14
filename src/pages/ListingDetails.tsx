import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { listingService } from "@/services/listingService";
import { messageService, Profile } from "@/services/messageService";
import { Listing } from "@/types/listing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, MessageCircle, Share2, ArrowLeft, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FavoriteButton } from "@/components/FavoriteButton";
import { MapComponent } from "@/components/MapComponent";

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [sellerProfile, setSellerProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageContent, setMessageContent] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchListingAndSeller = async () => {
      if (!id) return;
      try {
        const listingData = await listingService.fetchDetails(id);
        setListing(listingData);

        if (listingData) {
          const profileData = await messageService.fetchSellerProfile(listingData.userId);
          setSellerProfile(profileData);
        }
      } catch (error) {
        console.error("Failed to fetch listing or seller", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar o anúncio.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListingAndSeller();
  }, [id, toast]);

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para enviar mensagens.",
      });
      return;
    }

    if (!listing || !messageContent.trim()) return;

    setSendingMessage(true);
    try {
      await messageService.sendMessage(listing.id, listing.userId, messageContent);
      toast({
        title: "Sucesso!",
        description: "Mensagem enviada com sucesso.",
      });
      setMessageContent("");
    } catch (error) {
      console.error("Failed to send message", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao enviar mensagem.",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (sellerProfile?.phone) {
      const message = `Olá! Vi seu anúncio "${listing?.title}" no TanaMão e gostaria de saber mais.`;
      const url = `https://wa.me/${sellerProfile.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

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

  const isOwner = user?.id === listing.userId;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/10 pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb / Back */}
          <div className="mb-6 flex justify-between items-center">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>

            <FavoriteButton
              listingId={listing.id}
              variant="outline"
              className="gap-2"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-background rounded-xl overflow-hidden shadow-sm border aspect-video relative">
                <img
                  src={listing.images[0] || "/placeholder.svg"}
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
                    <span>Publicado em {new Date(listing.createdAt).toLocaleDateString()}</span>
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
                    <p className="font-medium">Usado - Bom estado</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-background p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Localização</h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{listing.location}</span>
                </div>
                <MapComponent location={listing.location} />
              </div>

              {/* Message Form (Desktop) */}
              {!isOwner && (
                <div className="hidden lg:block bg-background p-6 rounded-xl shadow-sm border">
                  <h3 className="font-semibold mb-4">Enviar mensagem ao vendedor</h3>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Olá, tenho interesse neste produto..."
                      rows={4}
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <Button onClick={handleSendMessage} disabled={sendingMessage}>
                      {sendingMessage ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </div>
                </div>
              )}
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
                  {isOwner ? (
                    <Button asChild className="w-full text-lg gap-2" variant="secondary">
                       <Link to={`/listing/edit/${listing.id}`}>Editar Anúncio</Link>
                    </Button>
                  ) : (
                    <>
                      {sellerProfile?.phone && (
                        <Button
                          size="lg"
                          className="w-full text-lg gap-2 bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleWhatsAppClick}
                        >
                          <Phone className="w-5 h-5" />
                          Chat no WhatsApp
                        </Button>
                      )}
                      <Button size="lg" className="w-full text-lg gap-2" onClick={() => document.querySelector('textarea')?.focus()}>
                        <MessageCircle className="w-5 h-5" />
                        Enviar Mensagem
                      </Button>
                    </>
                  )}

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
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                    {sellerProfile?.avatar_url ? (
                        <img src={sellerProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span>{sellerProfile?.full_name?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{sellerProfile?.full_name || "Usuário Vendedor"}</p>
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

              {/* Mobile Message Form */}
              {!isOwner && (
                <div className="lg:hidden bg-background p-6 rounded-xl shadow-sm border">
                  <h3 className="font-semibold mb-4">Enviar mensagem ao vendedor</h3>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Olá, tenho interesse neste produto..."
                      rows={4}
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <Button onClick={handleSendMessage} disabled={sendingMessage} className="w-full">
                      {sendingMessage ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetails;