import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-background min-h-[500px] flex items-center pt-8 md:pt-16 pb-12">
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
          O que você procura hoje?
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
          As melhores ofertas do seu bairro, com segurança e rapidez.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2 bg-white p-2 rounded-full shadow-elevated border border-border/50 items-center pl-6 transition-shadow hover:shadow-xl">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por produtos, serviços e muito mais..."
              className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 placeholder:text-muted-foreground/50 h-12"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button size="lg" className="px-8 rounded-full h-12" onClick={handleSearch}>
              Buscar
            </Button>
          </div>
        </div>

        {/* CTA Buttons - Simplified */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" variant="secondary" className="rounded-full px-8 h-12 text-base" onClick={() => navigate('/search')}>
            Explorar Categorias
          </Button>
        </div>

        {/* Trust Indicators - Modernized */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-foreground/80 border-t border-border pt-12 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="text-center">
              <div className="font-semibold">100% Seguro</div>
              <div className="text-sm text-muted-foreground">Transações protegidas</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-center">
              <div className="font-semibold">Super Rápido</div>
              <div className="text-sm text-muted-foreground">Anuncie em segundos</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
              <span className="text-2xl">🏘️</span>
            </div>
            <div className="text-center">
              <div className="font-semibold">Local</div>
              <div className="text-sm text-muted-foreground">Seu bairro, sua cidade</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
