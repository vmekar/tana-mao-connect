import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
      title: "Oportunidades imperdíveis esperam por você",
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Simplified auto-scroll for presentation
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full bg-background pb-0 h-[300px] md:h-[320px]">
      {/* Carousel Banner Container */}
      <div className="relative w-full h-full max-h-[300px] md:max-h-[320px] overflow-hidden group bg-[#1a1a2e]">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full relative h-full">
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))' }} />
            </div>
          ))}
        </div>

        {/* Centered Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-white px-4 z-20 pointer-events-none">
          <div className="w-full max-w-[800px] flex flex-col items-center pointer-events-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-center mb-4 drop-shadow-lg transition-opacity duration-500">
              {slides[currentSlide].title}
            </h2>
            <p className="text-lg md:text-xl text-center mb-4 md:mb-6 drop-shadow-md text-gray-200 max-w-2xl transition-opacity duration-500">
              {slides[currentSlide].subtitle}
            </p>

            {/* Search Bar */}
            <div className="w-full bg-card p-3 md:p-4 rounded-xl shadow-elevated border border-border flex flex-col md:flex-row gap-3 items-center text-foreground">
              <div className="flex-1 flex items-center w-full bg-muted/50 rounded-lg px-4 h-12 border border-border/50 hover:border-border transition-colors">
                <Search className="h-5 w-5 text-muted-foreground mr-3" />
                <Input
                  type="text"
                  placeholder="Buscar em TemRolo..."
                  className="flex-1 border-0 bg-transparent text-base focus-visible:ring-0 p-0 placeholder:text-muted-foreground text-foreground"
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
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-30 pointer-events-auto transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-30 pointer-events-auto transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-auto">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-secondary w-8" : "bg-white/50 w-4"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
