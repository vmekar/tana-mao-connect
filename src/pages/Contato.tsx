import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Contato = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-2xl mx-auto mb-8">
          <h1>Contato</h1>
          <p className="lead">Fale com a gente. Estamos aqui para ajudar.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-card p-6 md:p-8 rounded-xl border shadow-sm">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input id="name" placeholder="Seu nome completo" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Assunto</label>
              <Input id="subject" placeholder="Ex: Problema com anúncio, Dúvida..." required />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Mensagem</label>
              <Textarea
                id="message"
                placeholder="Descreva detalhadamente como podemos te ajudar..."
                className="min-h-[150px]"
                required
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">Enviar Mensagem</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
