import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { listingService } from "@/services/listingService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";

// Form Schema
const formSchema = z.object({
  title: z.string().min(10, {
    message: "O título deve ter pelo menos 10 caracteres.",
  }).max(100, {
    message: "O título não pode ter mais de 100 caracteres.",
  }),
  description: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres.",
  }).max(2000, {
    message: "A descrição não pode ter mais de 2000 caracteres.",
  }),
  price: z.coerce.number().min(1, {
    message: "O preço deve ser maior que zero.",
  }),
  category: z.string({
    required_error: "Selecione uma categoria.",
  }),
  location: z.string().min(3, {
    message: "A localização é obrigatória.",
  }),
});

const CATEGORIES = [
  "Eletrônicos",
  "Veículos",
  "Imóveis",
  "Moda",
  "Casa & Jardim",
  "Informática",
  "Bebês & Crianças",
  "Esportes",
  "Música",
  "Negócios",
  "Animais",
  "Serviços",
];

const CreateListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // Store both the file object (for upload) and the URL (for preview)
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const uploadedImageUrls: string[] = [];

      // Upload images first
      for (const file of files) {
        const url = await listingService.uploadListingImage(file);
        uploadedImageUrls.push(url);
      }

      // If no images were uploaded, we might want to prevent submission or use a placeholder.
      // For now, let's proceed even without images, or add validation.
      // Ideally, the UI should enforce at least one image if required.

      await listingService.createListing({
        ...values,
        images: uploadedImageUrls,
      });

      toast({
        title: "Sucesso!",
        description: "Seu anúncio foi criado com sucesso.",
      });

      // Redirect to home or user listings
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao criar o anúncio. Verifique se você está logado.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles && newFiles.length > 0) {
      const file = newFiles[0];
      const previewUrl = URL.createObjectURL(file);

      setFiles([...files, file]);
      setPreviewUrls([...previewUrls, previewUrl]);
    }
  };

  const removeImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Criar Anúncio</h1>

        <div className="bg-background p-8 rounded-xl shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Anúncio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: iPhone 14 Pro Max 256GB - Estado de Novo" {...field} />
                    </FormControl>
                    <FormDescription>
                      Um título claro e descritivo ajuda seu anúncio a ser encontrado.
                    </FormDescription>
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
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
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
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Fotos do Produto</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover imagem"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {previewUrls.length < 5 && (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors flex flex-col items-center justify-center cursor-pointer bg-muted/5 relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        disabled={isLoading}
                      />
                      <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Adicionar Foto</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Adicione até 5 fotos. A primeira será a principal.</p>
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização (Bairro/Cidade)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pinheiros, São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    "Publicar Anúncio"
                  )}
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

export default CreateListing;
