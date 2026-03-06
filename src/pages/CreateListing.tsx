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
import { Loader2, Plus, X, Upload, Check, ChevronRight, ChevronLeft, MapPin, Tag, DollarSign, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Smartphone,
  Car,
  Home,
  Shirt,
  Sofa,
  Laptop,
  Baby,
  Dumbbell,
  Music,
  Briefcase,
  PawPrint,
  Wrench
} from "lucide-react";

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
  { id: 1, name: "Eletrônicos", icon: Smartphone, color: "bg-purple-100 text-purple-600 border-purple-200" },
  { id: 2, name: "Veículos", icon: Car, color: "bg-blue-100 text-blue-600 border-blue-200" },
  { id: 3, name: "Imóveis", icon: Home, color: "bg-green-100 text-green-600 border-green-200" },
  { id: 4, name: "Moda", icon: Shirt, color: "bg-pink-100 text-pink-600 border-pink-200" },
  { id: 5, name: "Casa & Jardim", icon: Sofa, color: "bg-orange-100 text-orange-600 border-orange-200" },
  { id: 6, name: "Informática", icon: Laptop, color: "bg-indigo-100 text-indigo-600 border-indigo-200" },
  { id: 7, name: "Bebês & Crianças", icon: Baby, color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
  { id: 8, name: "Esportes", icon: Dumbbell, color: "bg-red-100 text-red-600 border-red-200" },
  { id: 9, name: "Música", icon: Music, color: "bg-teal-100 text-teal-600 border-teal-200" },
  { id: 10, name: "Negócios", icon: Briefcase, color: "bg-slate-100 text-slate-600 border-slate-200" },
  { id: 11, name: "Animais", icon: PawPrint, color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
  { id: 12, name: "Serviços", icon: Wrench, color: "bg-cyan-100 text-cyan-600 border-cyan-200" },
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
  const [currentStep, setCurrentStep] = useState(1);

  // Location state
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Manage images: both existing URLs and new Files
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dragActive, setDragActive] = useState(false);

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
    mode: "onChange",
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

        if (user && listing.userId !== user.id) {
           toast({
            variant: "destructive",
            title: "Acesso Negado",
            description: "Você não tem permissão para editar este anúncio.",
          });
          navigate("/");
          return;
        }

        if (listing.location) {
          const parts = listing.location.split(" - ");
          if (parts.length === 2) {
            const [city, uf] = parts;
            setSelectedState(uf);
            setSelectedCity(city);
          }
        }

        form.reset({
          title: listing.title,
          description: listing.description || "",
          price: listing.price,
          category: listing.category,
          location: listing.location,
        });

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

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      // Step 1: Photos validation
      if (images.length === 0) {
        toast({
          variant: "destructive",
          title: "Atenção",
          description: "Adicione pelo menos uma foto para continuar.",
        });
        return;
      }
      isValid = true;
    } else if (currentStep === 2) {
      // Step 2: Details validation
      isValid = await form.trigger(["title", "description", "category"]);
    } else if (currentStep === 3) {
      // Step 3: Final validation
      isValid = await form.trigger();
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  // Image handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newImages: ImageItem[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push({
          url: URL.createObjectURL(file),
          file,
        });
      }
    });
    if (images.length + newImages.length > 5) {
       toast({
          variant: "destructive",
          title: "Limite de Imagens",
          description: "Você pode adicionar no máximo 5 imagens.",
        });
       return;
    }
    setImages([...images, ...newImages]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Price formatting
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const value = Number(rawValue) / 100;
    form.setValue("price", value, { shouldValidate: true });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const finalImageUrls: string[] = [];

      for (const img of images) {
        if (img.file) {
          const url = await listingService.uploadListingImage(img.file);
          finalImageUrls.push(url);
        } else {
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

  if (isFetching) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? "Editar Anúncio" : "Novo Anúncio"}
            </h1>
            <span>Passo {currentStep} de 3</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Fotos</span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Detalhes</span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Local & Preço</span>
          </div>
        </div>

        <div className="bg-background p-6 md:p-8 rounded-xl shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Step 1: Photos */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center space-y-2 mb-8">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold">Vamos começar pelas fotos</h2>
                    <p className="text-muted-foreground">Adicione fotos nítidas do seu produto para atrair mais compradores.</p>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                      dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/5"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">Clique ou arraste suas fotos aqui</p>
                        <p className="text-sm text-muted-foreground mt-1">Formatos suportados: JPG, PNG</p>
                      </div>
                      <Button type="button" variant="outline" className="mt-2">
                        Selecionar Arquivos
                      </Button>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                      {images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group shadow-sm">
                          <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="bg-destructive text-white rounded-full p-2 hover:bg-destructive/90 transition-colors"
                              title="Remover imagem"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
                              Capa Principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center space-y-2 mb-8">
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Tag className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold">Descreva seu produto</h2>
                    <p className="text-muted-foreground">Escolha a categoria e dê um título chamativo.</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-base">Selecione a Categoria</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = field.value === cat.name;
                            return (
                              <div
                                key={cat.id}
                                onClick={() => field.onChange(cat.name)}
                                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all duration-200 ${
                                  isSelected
                                    ? `border-primary bg-primary/5 ring-1 ring-primary`
                                    : "border-muted hover:border-primary/50 hover:bg-muted/5"
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.color} ${isSelected ? 'bg-white' : ''}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-medium text-center ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                                  {cat.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Anúncio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: iPhone 14 Pro Max 256GB - Impecável" className="text-lg py-6" {...field} />
                        </FormControl>
                         <FormDescription>
                          Use palavras-chave como marca, modelo e estado de conservação.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Detalhada</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conte mais sobre seu produto: tempo de uso, motivo da venda, detalhes técnicos..."
                            className="min-h-[150px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Price & Location */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center space-y-2 mb-8">
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold">Defina o preço e local</h2>
                    <p className="text-muted-foreground">Quanto custa e onde está o produto?</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço de Venda</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                              <Input
                                type="text"
                                placeholder="0,00"
                                className="pl-12 text-xl font-bold h-14"
                                value={field.value ? (field.value * 100).toString().replace(/\D/g, "").replace(/(\d)(\d{2})$/, "$1,$2").replace(/(?=(\d{3})+(\D))\B/g, ".") : ""}
                                onChange={handlePriceChange}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        Localização do Produto
                      </div>

                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            setSelectedState(val);
                            setSelectedCity("");
                            form.setValue("location", "");
                          }}
                          value={selectedState}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
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
                            <SelectTrigger className="h-12">
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
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex justify-between pt-8 border-t">
                {currentStep === 1 ? (
                   <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isLoading}>
                    Cancelar
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading} className="gap-2 pl-2">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNext} className="gap-2 pr-2 px-6">
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="gap-2 px-8 shadow-lg hover:shadow-xl transition-all bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {isEditing ? "Salvar Alterações" : "Publicar Agora"}
                      </>
                    )}
                  </Button>
                )}
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
