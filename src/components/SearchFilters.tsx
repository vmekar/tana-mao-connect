import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchFilters as SearchFiltersType } from "@/types/listing";
import { useState, useEffect } from "react";
import { locationService, State, City } from "@/services/locationService";

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
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || "");

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    locationService.fetchStates().then(setStates);
  }, []);

  useEffect(() => {
    if (selectedState && selectedState !== "all") {
      locationService.fetchCities(selectedState).then(setCities);
    } else {
      setCities([]);
    }
  }, [selectedState]);

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
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location: loc,
    });
  };

  const handleClear = () => {
    setCategory("Todos");
    setMinPrice("");
    setMaxPrice("");
    setSelectedState("");
    setSelectedCity("");
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

      <div className="space-y-2">
        <Label>Estado (UF)</Label>
        <Select
          value={selectedState}
          onValueChange={(val) => {
            setSelectedState(val);
            setSelectedCity("");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os Estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.sigla}>
                {state.sigla} - {state.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cidade</Label>
        <Select
          value={selectedCity}
          onValueChange={setSelectedCity}
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
