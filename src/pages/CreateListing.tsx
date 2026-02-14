import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { listingService } from "@/services/listingService";
import { locationService, State, City } from "@/services/locationService";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

interface ImageItem {
  url: string;
  file?: File;
}

const CreateListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);

  // Location state
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Manage images: both existing URLs and new Files
  const [images, setImages] = useState<ImageItem[]>([]);

  const isEditing = !!id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      category: "",
    },
  });

  useEffect(() => {
    locationService.fetchStates().then(setStates);
  }, []);

  useEffect(() => {
    if (selectedState) {
      locationService.fetchCities(selectedState).then(setCities);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      try {
        const listing = await listingService.fetchDetails(id);

        if (!listing) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Anúncio não encontrado.",
          });
          navigate("/my-ads");
          return;
        }

        // Verify ownership
        if (user && listing.userId !== user.id) {
           toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: "Você não tem permissão para editar este anúncio.",
          });
          navigate("/");
          return;
        }

        // Parse location
        if (listing.location) {
          const parts = listing.location.split(" - ");
          if (parts.length === 2) {
            const [city, uf] = parts;
            setSelectedState(uf);
            setSelectedCity(city);
          }
        }

        // Populate form
        form.reset({
          title: listing.title,
          description: listing.description || "",
          price: listing.price,
          category: listing.category,
          location: listing.location,
        });

        // Populate images
        setImages(listing.images.map(url => ({ url })));

      } catch (error) {
        console.error("Failed to fetch listing", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar o anúncio.",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchListing();
  }, [id, form, navigate, toast, user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const finalImageUrls: string[] = [];

      // Process images
      for (const img of images) {
        if (img.file) {
          // Upload new file
          const url = await listingService.uploadListingImage(img.file);
          finalImageUrls.push(url);
        } else {
          // Keep existing URL
          finalImageUrls.push(img.url);
        }
      }

      const listingData = {
        ...values,
        images: finalImageUrls,
      };

      if (isEditing && id) {
        await listingService.updateListing(id, listingData);
        toast({
          title: "Sucesso!",
          description: "Seu anúncio foi atualizado.",
        });
      } else {
        await listingService.createListing(listingData);
        toast({
          title: "Sucesso!",
          description: "Seu anúncio foi criado com sucesso.",
        });
      }

      // Redirect to home or user listings
      navigate("/my-ads");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'criar'} o anúncio.`,
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

      setImages([...images, { url: previewUrl, file }]);
    }
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (isFetching) {
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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {isEditing ? "Editar Anúncio" : "Criar Anúncio"}
        </h1>

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
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                      <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
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

                  {images.length < 5 && (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>Estado (UF)</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      setSelectedState(val);
                      setSelectedCity(""); // Reset city when state changes
                      form.setValue("location", ""); // Reset location until city is selected
                    }}
                    value={selectedState}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.sigla}>
                          {state.sigla} - {state.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      setSelectedCity(val);
                      form.setValue("location", `${val} - ${selectedState}`, { shouldValidate: true });
                    }}
                    value={selectedCity}
                    disabled={!selectedState}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a Cidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.nome}>
                          {city.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              {/* Hidden field for validation */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.location && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.location.message}</p>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Salvar Alterações" : "Publicar Anúncio"}
                    </>
                  ) : (
                    isEditing ? "Salvar Alterações" : "Publicar Anúncio"
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
