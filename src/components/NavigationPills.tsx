import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
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
  Wrench,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const categories = [
  { id: 1, name: "Eletrônicos", icon: Smartphone, color: "bg-purple-100 text-purple-600" },
  { id: 2, name: "Veículos", icon: Car, color: "bg-blue-100 text-blue-600" },
  { id: 3, name: "Imóveis", icon: Home, color: "bg-green-100 text-green-600" },
  { id: 4, name: "Moda", icon: Shirt, color: "bg-pink-100 text-pink-600" },
  { id: 5, name: "Casa & Jardim", icon: Sofa, color: "bg-orange-100 text-orange-600" },
  { id: 6, name: "Informática", icon: Laptop, color: "bg-indigo-100 text-indigo-600" },
  { id: 7, name: "Bebês & Crianças", icon: Baby, color: "bg-yellow-100 text-yellow-600" },
  { id: 8, name: "Esportes", icon: Dumbbell, color: "bg-red-100 text-red-600" },
  { id: 9, name: "Música", icon: Music, color: "bg-teal-100 text-teal-600" },
  { id: 10, name: "Negócios", icon: Briefcase, color: "bg-slate-100 text-slate-600" },
  { id: 11, name: "Animais", icon: PawPrint, color: "bg-emerald-100 text-emerald-600" },
  { id: 12, name: "Serviços", icon: Wrench, color: "bg-cyan-100 text-cyan-600" },
];

export const NavigationPills = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <section className="container mx-auto px-4 py-4 md:py-6">
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 bg-background border shadow-md p-1.5 md:p-2 rounded-full hidden md:flex items-center justify-center hover:bg-muted transition-opacity duration-300 ${
            showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto pb-4 gap-3 md:gap-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/search?category=${category.name}`}
                className="group flex flex-col md:flex-row items-center gap-2 md:gap-3 p-2 md:pr-4 rounded-full bg-card hover:bg-muted transition-all duration-300 border shadow-sm shrink-0 snap-start min-w-[72px] md:min-w-[140px]"
              >
                <div className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-center md:text-left text-foreground/80 group-hover:text-primary transition-colors whitespace-nowrap">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 bg-background border shadow-md p-1.5 md:p-2 rounded-full hidden md:flex items-center justify-center hover:bg-muted transition-opacity duration-300 ${
            showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>
      </div>
    </section>
  );
};
