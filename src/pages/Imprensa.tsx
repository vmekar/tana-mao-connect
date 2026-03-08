import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Megaphone } from "lucide-react";

const Imprensa = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Megaphone className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-heading font-black mb-4">Imprensa</h1>
        <p className="text-xl text-muted-foreground max-w-lg">
          Área de imprensa em desenvolvimento. Contato: contato@temrolo.com.br
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Imprensa;
