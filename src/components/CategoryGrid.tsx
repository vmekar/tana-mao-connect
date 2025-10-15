import { Card } from "@/components/ui/card";
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
  { id: 1, name: "Eletrônicos", icon: Smartphone, color: "from-purple-500 to-purple-600" },
  { id: 2, name: "Veículos", icon: Car, color: "from-blue-500 to-blue-600" },
  { id: 3, name: "Imóveis", icon: Home, color: "from-green-500 to-green-600" },
  { id: 4, name: "Moda", icon: Shirt, color: "from-pink-500 to-pink-600" },
  { id: 5, name: "Casa & Jardim", icon: Sofa, color: "from-orange-500 to-orange-600" },
  { id: 6, name: "Informática", icon: Laptop, color: "from-indigo-500 to-indigo-600" },
  { id: 7, name: "Bebês & Crianças", icon: Baby, color: "from-yellow-500 to-yellow-600" },
  { id: 8, name: "Esportes", icon: Dumbbell, color: "from-red-500 to-red-600" },
  { id: 9, name: "Música", icon: Music, color: "from-teal-500 to-teal-600" },
  { id: 10, name: "Negócios", icon: Briefcase, color: "from-slate-500 to-slate-600" },
  { id: 11, name: "Animais", icon: PawPrint, color: "from-emerald-500 to-emerald-600" },
  { id: 12, name: "Serviços", icon: Wrench, color: "from-cyan-500 to-cyan-600" },
];

export const CategoryGrid = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Explore por Categoria
      </h2>
      <p className="text-center text-muted-foreground mb-12">
        Encontre exatamente o que você precisa
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-elevated transition-all duration-300 hover:scale-105"
            >
              <div className="p-6 flex flex-col items-center justify-center gap-3">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-center">{category.name}</h3>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
