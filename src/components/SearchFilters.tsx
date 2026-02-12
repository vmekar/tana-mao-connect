import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchFilters as SearchFiltersType } from "@/types/listing";
import { useState } from "react";

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
  const [location, setLocation] = useState(initialFilters.location || "");

  const handleApply = () => {
    onFilterChange({
      category: category === "Todos" ? undefined : category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location: location || undefined,
    });
  };

  const handleClear = () => {
    setCategory("Todos");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
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
        <Label>Localização</Label>
        <Input
          placeholder="Cidade ou Estado"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
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
