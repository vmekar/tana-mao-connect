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
  Wrench
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
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Categorias Populares
      </h2>

      <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory hide-scrollbar">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              to={`/search?category=${category.name}`}
              className="group flex flex-col md:flex-row items-center gap-3 p-3 md:pr-6 rounded-full bg-card hover:bg-muted transition-all duration-300 border shadow-sm shrink-0 snap-start min-w-[100px] md:min-w-[180px]"
            >
              <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-center md:text-left text-foreground/80 group-hover:text-primary transition-colors whitespace-nowrap">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
