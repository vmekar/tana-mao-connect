import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PenTool } from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <PenTool className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-4xl font-heading font-black mb-4">Blog TemRolo</h1>
        <p className="text-xl text-muted-foreground max-w-lg">
          Em breve, novidades, dicas de vendas e histórias da nossa comunidade.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
