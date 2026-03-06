import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown } from "lucide-react";
import { SearchFilters as SearchFiltersType } from "@/types/listing";
import { useState, useEffect } from "react";
import { locationService, State, City } from "@/services/locationService";

const CATEGORY_HIERARCHY: Record<string, string[]> = {
  "Eletrônicos": ["Celulares", "Computadores", "TV e Vídeo", "Áudio", "Videogames"],
  "Veículos": ["Carros", "Motos", "Caminhões", "Peças e Acessórios", "Barcos e Lanchas"],
  "Imóveis": ["Apartamentos", "Casas", "Terrenos", "Comercial"],
  "Moda": ["Roupas Femininas", "Roupas Masculinas", "Calçados", "Acessórios"],
  "Casa & Jardim": ["Móveis", "Decoração", "Eletrodomésticos", "Jardinagem"],
  "Informática": ["Notebooks", "Desktops", "Acessórios", "Componentes"],
  "Bebês & Crianças": ["Roupas", "Brinquedos", "Carrinhos e Cadeirinhas", "Móveis"],
  "Esportes": ["Bicicletas", "Fitness", "Esportes Radicais", "Artigos Esportivos"],
  "Música": ["Instrumentos Musicais", "Equipamentos de Áudio", "Discos e CDs"],
  "Negócios": ["Equipamentos Comerciais", "Mobiliário Corporativo", "Serviços"],
  "Animais": ["Cachorros", "Gatos", "Acessórios", "Outros"],
  "Serviços": ["Limpeza", "Reformas", "Aulas", "Transporte"],
};

const CATEGORIES = [
  "Todos",
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

interface SearchFiltersProps {
  initialFilters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
}

export const SearchFilters = ({ initialFilters, onFilterChange }: SearchFiltersProps) => {
  const [category, setCategory] = useState(initialFilters.category || "Todos");
  const [subcategory, setSubcategory] = useState(initialFilters.subcategory || "");
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || "");

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [bairrosOptions, setBairrosOptions] = useState<string[]>([]);
  const [selectedBairros, setSelectedBairros] = useState<string[]>(initialFilters.bairros || []);

  useEffect(() => {
    locationService.fetchStates().then(setStates);
  }, []);

  // Clear subcategory when category changes
  useEffect(() => {
    if (category !== initialFilters.category) {
      setSubcategory("");
    }
  }, [category, initialFilters.category]);

  useEffect(() => {
    if (selectedState && selectedState !== "all") {
      locationService.fetchCities(selectedState).then(setCities);
    } else {
      setCities([]);
    }
    // Clear bairros when state changes
    setBairrosOptions([]);
    setSelectedBairros([]);
    // The select onValueChange already clears selectedCity, but if selectedState
    // changes programmatically or via URL, we should ensure city is cleared if
    // it doesn't match the new state's cities (for simplicity, we clear it).
    // Note: If initialFilters.location is what triggered this, we don't want to
    // clear the city immediately if it was just set.
  }, [selectedState]);

  useEffect(() => {
    // Clear selected bairros when city changes
    // Fetch new bairros if city is selected
    if (selectedCity && selectedCity !== "all" && cities.length > 0) {
      const cityObj = cities.find(c => c.nome === selectedCity);
      if (cityObj) {
        locationService.fetchBairros(cityObj.id).then(options => setBairrosOptions(options));
      } else {
        setBairrosOptions([]);
      }
    } else {
      setBairrosOptions([]);
    }
    // Only reset if city explicitly changes in the UI, not on initial load
    if (initialFilters.location && selectedCity && initialFilters.location.startsWith(selectedCity)) {
        // Do not clear on initial render for exact match
    } else {
        setSelectedBairros([]);
    }
  }, [selectedCity, cities, initialFilters.location]);

  useEffect(() => {
    if (initialFilters.location) {
      const parts = initialFilters.location.split(" - ");
      if (parts.length === 2) {
        setSelectedCity(parts[0]);
        setSelectedState(parts[1]);
      } else if (parts.length === 1 && parts[0].length === 2) {
        setSelectedState(parts[0]);
        setSelectedCity("");
      }
    } else {
      setSelectedState("");
      setSelectedCity("");
    }
  }, [initialFilters.location]);

  const handleApply = () => {
    let loc = undefined;
    if (selectedState && selectedState !== "all") {
        if (selectedCity && selectedCity !== "all") {
            loc = `${selectedCity} - ${selectedState}`;
        } else {
            loc = selectedState;
        }
    }

    onFilterChange({
      category: category === "Todos" ? undefined : category,
      subcategory: subcategory ? subcategory : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location: loc,
      bairros: selectedBairros.length > 0 ? selectedBairros : undefined,
    });
  };

  const handleClear = () => {
    setCategory("Todos");
    setSubcategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedBairros([]);
    onFilterChange({});
  };

  return (
    <div className="bg-background p-4 rounded-lg shadow-sm border space-y-6">
      <h3 className="font-semibold text-lg">Filtros</h3>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {CATEGORY_HIERARCHY[category] && (
        <div className="space-y-2">
          <Label>Subcategoria</Label>
          <Select value={subcategory} onValueChange={setSubcategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_HIERARCHY[category].map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label>Estado (UF)</Label>
        <Select
          value={selectedState}
          onValueChange={(val) => {
            setSelectedState(val);
            setSelectedCity("");
            setSelectedBairros([]);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os Estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.sigla}>
                {state.sigla}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cidade</Label>
        <Select
          value={selectedCity}
          onValueChange={(val) => {
            setSelectedCity(val);
            setSelectedBairros([]);
          }}
          disabled={!selectedState || selectedState === "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as Cidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.nome}>
                {city.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCity && selectedCity !== "all" && bairrosOptions.length > 0 && (
        <div className="space-y-2">
          <Label>Bairros</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between font-normal h-auto min-h-10 px-3 py-2 bg-background"
              >
                {selectedBairros.length === 0 ? (
                  <span className="text-muted-foreground line-clamp-1">Selecionar bairros...</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selectedBairros.map((bairro) => (
                      <Badge
                        variant="secondary"
                        key={bairro}
                        className="mr-1 mb-1 font-normal text-xs"
                      >
                        {bairro}
                        <div
                          role="button"
                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setSelectedBairros(selectedBairros.filter((b) => b !== bairro));
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedBairros(selectedBairros.filter((b) => b !== bairro));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </div>
                      </Badge>
                    ))}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <ScrollArea className="h-[200px] p-4">
                <div className="space-y-4">
                  {bairrosOptions.map((bairro) => (
                    <div key={bairro} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bairro-${bairro}`}
                        checked={selectedBairros.includes(bairro)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBairros([...selectedBairros, bairro]);
                          } else {
                            setSelectedBairros(selectedBairros.filter((b) => b !== bairro));
                          }
                        }}
                      />
                      <Label
                        htmlFor={`bairro-${bairro}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {bairro}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="space-y-2">
        <Label>Preço (R$)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button onClick={handleApply}>Aplicar Filtros</Button>
        <Button variant="outline" onClick={handleClear}>Limpar</Button>
      </div>
    </div>
  );
};
