import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PlanosPrecos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-3xl mx-auto">
          <h1>Planos e Preços</h1>
          <p className="lead">Conheça as opções para potencializar suas vendas no TemRolo.</p>

          <h2>Anunciar é grátis!</h2>
          <p>No TemRolo, criar um anúncio e vender para pessoas da sua região é 100% gratuito. Não cobramos comissão sobre as vendas e você pode ter múltiplos anúncios ativos simultaneamente nas categorias básicas.</p>

          <h2>Destaques de Anúncio (Em Breve)</h2>
          <p>Para quem quer vender mais rápido, em breve ofereceremos opções de destaque para que seu produto apareça nas primeiras posições das buscas e na página inicial.</p>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="mt-0">Plano Grátis</h3>
            <ul>
              <li>Anúncios ilimitados em categorias padrão.</li>
              <li>Até 6 fotos por anúncio.</li>
              <li>Chat liberado com compradores.</li>
              <li>Zero taxas e comissões.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlanosPrecos;
