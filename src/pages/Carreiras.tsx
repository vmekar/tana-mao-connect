import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Briefcase } from "lucide-react";

const Carreiras = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Briefcase className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-heading font-black mb-4">Carreiras</h1>
        <p className="text-xl text-muted-foreground max-w-lg">
          Vagas abertas em breve! Venha construir o futuro do comércio local com a gente.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Carreiras;
