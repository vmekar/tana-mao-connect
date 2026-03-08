import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ComoComprar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-3xl mx-auto">
          <h1>Como Comprar no TemRolo</h1>
          <p className="lead">Guia passo a passo para encontrar e comprar o que você precisa com segurança.</p>

          <h2>1. Busque pelo produto</h2>
          <p>Utilize nossa barra de pesquisa na página inicial. Digite o que procura e utilize os filtros de categoria, localização e preço para refinar os resultados e encontrar a melhor oferta perto de você.</p>

          <h2>2. Analise o anúncio</h2>
          <p>Leia atentamente a descrição, verifique as fotos e veja as informações do vendedor. Avalie o tempo de conta, se há verificações e outras informações que demonstrem credibilidade.</p>

          <h2>3. Entre em contato com o vendedor</h2>
          <p>Gostou do produto? Utilize nosso chat interno para conversar com o vendedor. Tire suas dúvidas, negocie o valor se achar pertinente e combine os detalhes da entrega ou retirada.</p>

          <h2>4. Marque um encontro seguro</h2>
          <p>Prefira sempre marcar encontros em locais públicos e movimentados durante o dia (como shoppings, estações de metrô ou praças movimentadas). Se possível, vá acompanhado.</p>

          <h2>5. Verifique o produto antes de pagar</h2>
          <p>No momento do encontro, teste o produto, verifique se está de acordo com o anunciado e só então realize o pagamento, preferencialmente via PIX na hora.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComoComprar;
