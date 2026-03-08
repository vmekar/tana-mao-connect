import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const Denunciar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-3 text-destructive mb-4">
            <AlertTriangle className="w-8 h-8" />
            <h1 className="m-0 text-destructive">Denunciar</h1>
          </div>
          <p className="lead">Ajude-nos a manter o TemRolo seguro. Reporte anúncios suspeitos, fraudes ou comportamento inadequado.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-card p-6 md:p-8 rounded-xl border shadow-sm border-destructive/20">
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium">Link do Anúncio ou Perfil</label>
              <Input id="link" placeholder="https://temrolo.com.br/listing/..." required />
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">Motivo da Denúncia</label>
              <select
                id="reason"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Selecione um motivo...</option>
                <option value="fraude">Suspeita de fraude / golpe</option>
                <option value="falso">Produto falsificado</option>
                <option value="ofensivo">Conteúdo ofensivo ou inadequado</option>
                <option value="spam">Spam / Anúncio repetido</option>
                <option value="outro">Outro motivo</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium">Detalhes (Opcional)</label>
              <Textarea
                id="details"
                placeholder="Forneça mais informações que nos ajudem a analisar a denúncia..."
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" variant="destructive" className="w-full md:w-auto">Enviar Denúncia</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Denunciar;
