import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HeroCarousel = () => {
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

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1555529771-835f59bfc50c?q=80&w=1200&auto=format&fit=crop",
      title: "As melhores ofertas estão aqui",
      subtitle: "Compre e venda de forma rápida e segura.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop",
      title: "Encontre o carro dos seus sonhos",
      subtitle: "Milhares de veículos com os melhores preços.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
      title: "Seu novo lar espera por você",
      subtitle: "Imóveis para alugar e comprar em todo o Brasil.",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Simplified auto-scroll for presentation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full bg-background pb-8">
      {/* Carousel Banner Container */}
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden group">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover brightness-[0.6]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                <h2 className="text-3xl md:text-5xl font-heading font-black text-center mb-4 drop-shadow-lg">{slide.title}</h2>
                <p className="text-lg md:text-xl text-center max-w-2xl drop-shadow-md text-gray-200">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-6" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="container mx-auto px-4 relative z-20 -mt-8 md:-mt-10">
        <div className="max-w-3xl mx-auto bg-card p-3 md:p-4 rounded-xl shadow-elevated border border-border flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 flex items-center w-full bg-muted/50 rounded-lg px-4 h-12 border border-border/50 hover:border-border transition-colors">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                type="text"
                placeholder="Buscar em TemRolo..."
                className="flex-1 border-0 bg-transparent text-base focus-visible:ring-0 p-0 placeholder:text-muted-foreground"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button size="lg" className="w-full md:w-auto h-12 px-8 font-semibold rounded-lg" onClick={handleSearch}>
              Buscar
            </Button>
        </div>
      </div>
    </section>
  );
};
