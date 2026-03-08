import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const RegrasSeguranca = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-3xl mx-auto">
          <h1>Regras de Segurança</h1>
          <p className="lead">A segurança da nossa comunidade é prioridade. Siga estas dicas para evitar golpes e fazer negócios com tranquilidade.</p>

          <h2>Para Compradores</h2>
          <ul>
            <li>Desconfie de ofertas muito abaixo do valor de mercado.</li>
            <li>Nunca faça pagamentos adiantados por PIX, boleto ou transferência antes de ver o produto.</li>
            <li>Marque encontros em locais públicos, movimentados e bem iluminados.</li>
            <li>Vá acompanhado, se possível, ao encontrar com o vendedor.</li>
            <li>Teste o produto antes de finalizar o pagamento.</li>
            <li>Comunique-se sempre através do chat da plataforma TemRolo.</li>
          </ul>

          <h2>Para Vendedores</h2>
          <ul>
            <li>Não entregue o produto antes de confirmar que o valor está disponível na sua conta bancária.</li>
            <li>Desconfie de comprovantes de pagamento enviados por WhatsApp ou email (eles podem ser falsificados). Verifique no aplicativo do seu banco.</li>
            <li>Não aceite pagamentos em cheques ou depósitos em caixas eletrônicos (envelopes vazios).</li>
            <li>Seja claro e honesto sobre as condições do produto no anúncio.</li>
            <li>Marque encontros para a entrega em locais públicos e seguros.</li>
          </ul>

          <h2>O que o TemRolo NUNCA faz</h2>
          <ul>
            <li>Nós nunca pedimos sua senha por email, SMS ou WhatsApp.</li>
            <li>Não intermediamos entregas via Uber, 99 ou motoboys.</li>
            <li>Não cobramos taxas de liberação de pagamento.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegrasSeguranca;
