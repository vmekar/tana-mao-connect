import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listingService } from "@/services/listingService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ImagePlus, X } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(100, "Título muito longo"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  price: z.coerce.number().min(1, "Preço deve ser maior que zero"),
  category: z.string().min(1, "Selecione uma categoria"),
  location: z.string().min(3, "Informe a localização (Bairro, Cidade)"),
});

const categories = [
  "Eletrônicos", "Veículos", "Imóveis", "Moda", "Casa & Jardim",
  "Informática", "Bebês & Crianças", "Esportes", "Música",
  "Negócios", "Animais", "Serviços"
];

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      location: "",
    },
  });

  const handleAddImage = () => {
    if (!imageUrlInput) return;
    // Basic validation for URL
    try {
      new URL(imageUrlInput);
      setImages([...images, imageUrlInput]);
      setImageUrlInput("");
    } catch {
      toast.error("URL de imagem inválida");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Check auth
    // Note: Since we are using mock mode in service, we might not need real auth,
    // but good practice to check.
    // if (!user) {
    //   toast.error("Você precisa estar logado para anunciar");
    //   navigate("/auth");
    //   return;
    // }

    if (images.length === 0) {
      toast.error("Adicione pelo menos uma imagem");
      return;
    }

    setLoading(true);
    try {
      await listingService.create({
        ...values,
        images: images,
      });
      toast.success("Anúncio criado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar anúncio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Criar Anúncio</h1>
          <p className="text-muted-foreground">Preencha os detalhes do seu produto ou serviço.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Anúncio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: iPhone 14 Pro Max 256GB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes do seu produto, tempo de uso, estado de conservação, etc."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro, Cidade - UF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section (Mocked) */}
            <div className="space-y-4">
              <Label>Imagens</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Cole uma URL de imagem (ex: https://images.unsplash.com/...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <Button type="button" onClick={handleAddImage} variant="outline">
                  <ImagePlus className="w-4 h-4" />
                </Button>
              </div>
              <FormDescription>
                Para este protótipo, use URLs de imagens públicas (ex: Unsplash).
              </FormDescription>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate("/")}>
                Cancelar
              </Button>
              <Button type="submit" size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Publicar Anúncio
              </Button>
            </div>

          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
};

export default CreateListing;
