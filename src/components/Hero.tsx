import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBanner} 
          alt="TanaMão - Conectando pessoas localmente" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 drop-shadow-lg">
          Tá na Mão! 🤝
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          As melhores ofertas do seu bairro, com segurança e rapidez.
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-2 bg-background/95 backdrop-blur-sm p-2 rounded-lg shadow-elevated">
            <Input
              type="text"
              placeholder="O que você está procurando?"
              className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0"
            />
            <Button variant="hero" size="lg" className="px-8">
              <Search className="mr-2 h-5 w-5" />
              Buscar
            </Button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="cta" size="xl">
            Anunciar Grátis
          </Button>
          <Button variant="outline" size="xl" className="bg-background/90 hover:bg-background border-primary-foreground/20 text-foreground">
            Ver Categorias
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-primary-foreground/80">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="text-left">
              <div className="font-semibold">100% Seguro</div>
              <div className="text-sm opacity-80">Transações protegidas</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-left">
              <div className="font-semibold">Super Rápido</div>
              <div className="text-sm opacity-80">Anuncie em segundos</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-2xl">🏘️</span>
            </div>
            <div className="text-left">
              <div className="font-semibold">Local</div>
              <div className="text-sm opacity-80">Seu bairro, sua cidade</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
