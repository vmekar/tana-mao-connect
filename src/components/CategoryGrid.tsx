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

export const CategoryGrid = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-4">
        Explore por Categoria
      </h2>
      <p className="text-center text-muted-foreground mb-12">
        Encontre exatamente o que você precisa
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.id} to={`/search?category=${category.name}`} className="group flex flex-col items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300">
              <div className={`w-20 h-20 rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <Icon className="w-9 h-9" />
              </div>
              <span className="text-base font-medium text-center text-foreground/80 group-hover:text-primary transition-colors">{category.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
