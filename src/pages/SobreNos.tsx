import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const SobreNos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-3xl mx-auto">
          <h1>Sobre Nós</h1>
          <p className="lead">Conheça a história e a missão do TemRolo.</p>

          <h2>Nossa Missão</h2>
          <p>O TemRolo nasceu com o objetivo de conectar pessoas de uma mesma região, facilitando a compra, venda e troca de produtos usados e novos de forma simples, rápida e segura.</p>

          <h2>Por que escolher o TemRolo?</h2>
          <p>Acreditamos na economia circular e no comércio local. Ao comprar de alguém perto de você, além de conseguir ótimos negócios, você ajuda a reduzir o impacto ambiental e movimenta a economia da sua comunidade.</p>

          <h2>Nossa Equipe</h2>
          <p>Somos um time apaixonado por tecnologia e por resolver problemas reais do dia a dia. Trabalhamos constantemente para melhorar a plataforma e oferecer a melhor experiência para nossos usuários.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SobreNos;
