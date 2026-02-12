import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { messageService, InboxItem } from "@/services/messageService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Inbox = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    const fetchInbox = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const data = await messageService.fetchInbox(user.id);
        setInbox(data);
      } catch (error) {
        console.error("Failed to fetch inbox", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar suas mensagens.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Caixa de Entrada</h1>

        {inbox.length === 0 ? (
          <div className="text-center py-16 bg-background rounded-xl border border-dashed">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-4">
              Você ainda não recebeu mensagens.
            </h3>
            <Button asChild variant="outline">
              <Link to="/my-ads">Gerenciar meus anúncios</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-background rounded-xl shadow-sm border p-6">
            <Accordion type="single" collapsible className="w-full">
              {inbox.map((item) => (
                <AccordionItem key={item.listingId} value={item.listingId}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full pr-4">
                      <div className="text-left">
                        <span className="font-semibold text-lg">{item.listingTitle}</span>
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.messages.length} mensage{item.messages.length > 1 ? 'ns' : 'm'}
                        </div>
                      </div>
                      <Link
                        to={`/listing/${item.listingId}`}
                        className="text-primary hover:underline text-sm flex items-center gap-1 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver Anúncio <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {item.messages.map((msg) => (
                        <div key={msg.id} className="bg-muted/30 p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-primary">{msg.senderName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Inbox;
