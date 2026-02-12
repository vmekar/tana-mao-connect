import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { messageService, Profile as ProfileType } from "@/services/messageService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { User, Phone } from "lucide-react";

// Form Schema
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  phone: z.string().regex(/^\d{10,13}$/, {
    message: "Digite um número válido (apenas dígitos, inclua DDD). Ex: 11999998888",
  }),
});

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      if (!user) return;

      try {
        const data = await messageService.fetchSellerProfile(user.id);
        if (data) {
          form.reset({
            fullName: data.full_name || "",
            phone: data.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar seu perfil.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, navigate, toast, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    setSaving(true);
    try {
      await messageService.updateProfile(user.id, {
        full_name: values.fullName,
        phone: values.phone,
      });

      toast({
        title: "Sucesso!",
        description: "Seu perfil foi atualizado.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil.",
      });
    } finally {
      setSaving(false);
    }
  }

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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

        <div className="bg-background p-8 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
              {form.getValues("fullName")?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.email}</h2>
              <p className="text-muted-foreground">Membro desde {new Date(user?.created_at || "").getFullYear()}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Exibição</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Seu nome completo" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Este nome aparecerá nos seus anúncios.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="11999998888" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Para que compradores possam entrar em contato via WhatsApp. Apenas números.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving} className="min-w-[150px]">
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
