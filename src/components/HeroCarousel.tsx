import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, MapPin, Crosshair } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HeroCarousel = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.append('query', query.trim());
    }
    if (location.trim()) {
      params.append('location', location.trim());
    }
    const queryString = params.toString();
    navigate(queryString ? `/search?${queryString}` : '/search');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1200&auto=format&fit=crop",
      title: "As melhores ofertas estão aqui",
      subtitle: "Compre e venda de forma rápida e segura.",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
      title: "Encontre o carro dos seus sonhos",
      subtitle: "Milhares de veículos com os melhores preços.",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop",
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
      <div className="relative w-full h-[300px] md:h-[320px] max-h-[300px] md:max-h-[320px] overflow-hidden group bg-[#1a1a2e]">
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
              <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-center mb-4 drop-shadow-lg">{slide.title}</h2>
                <p className="text-lg md:text-xl text-center max-w-2xl drop-shadow-md text-gray-200">{slide.subtitle}</p>
              </div>
            </div>
          ))}
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

      {/* Floating Search Bar */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-white px-4 z-20 pointer-events-none">
        <div className="max-w-4xl mx-auto bg-card p-3 md:p-4 rounded-xl shadow-elevated border border-border flex flex-col md:flex-row gap-3 items-center pointer-events-auto text-foreground">
          <div className="flex-1 flex flex-col md:flex-row w-full gap-3 md:gap-0">
            <div className="flex-1 flex items-center w-full bg-muted/50 rounded-lg md:rounded-r-none md:rounded-l-lg px-4 h-12 border border-border/50 hover:border-border transition-colors md:border-r-0">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                type="text"
                placeholder="O que você está procurando?"
                className="flex-1 border-0 bg-transparent text-base focus-visible:ring-0 p-0 placeholder:text-muted-foreground"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="w-full md:w-[250px] lg:w-[300px] flex items-center bg-muted/50 rounded-lg md:rounded-l-none md:rounded-r-lg px-4 h-12 border border-border/50 hover:border-border transition-colors relative md:border-l-0">
              <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                type="text"
                placeholder="Buscar em Rio de Janeiro, RJ..."
                className="flex-1 border-0 bg-transparent text-base focus-visible:ring-0 p-0 placeholder:text-muted-foreground pr-8"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="absolute right-3 p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                title="Usar minha localização"
                onClick={() => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        try {
                          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`, {
                            headers: {
                              "User-Agent": "TemRolo/1.0",
                              "Accept-Language": "pt-BR"
                            }
                          });
                          const data = await res.json();
                          if (data && data.address) {
                            const city = data.address.city || data.address.town || data.address.village;
                            const state = data.address.state;
                            if (city && state) {
                                setLocation(`${city}, ${state}`);
                            } else if (city || state) {
                                setLocation(city || state);
                            } else {
                                setLocation("Localização encontrada");
                            }
                          }
                        } catch (error) {
                          console.error("Error fetching location data:", error);
                        }
                      },
                      (error) => {
                        console.error("Error getting location:", error);
                      }
                    );
                  }
                }}
              >
                <Crosshair className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Button size="lg" className="w-full md:w-auto h-12 px-8 font-semibold rounded-lg shrink-0" onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </div>
    </section>
  );
};
