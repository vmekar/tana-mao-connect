import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ComoAnunciar = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-3xl mx-auto">
          <h1>Como Anunciar no TemRolo</h1>
          <p className="lead">Aprenda a criar anúncios atrativos e vender mais rápido em nossa plataforma.</p>

          <h2>1. Crie sua conta</h2>
          <p>Para começar a anunciar, você precisa ter uma conta no TemRolo. É rápido, fácil e gratuito. Clique em "Entrar" no canto superior direito e siga as instruções.</p>

          <h2>2. Clique em "Anunciar Grátis"</h2>
          <p>Com a conta criada e logado, clique no botão em destaque "Anunciar Grátis" no cabeçalho ou menu de navegação.</p>

          <h2>3. Preencha os detalhes do produto</h2>
          <p>Um bom anúncio precisa de boas informações. Seja claro e objetivo no título e capriche na descrição. Informe a categoria correta, estado de conservação, marca, modelo e todos os detalhes relevantes.</p>

          <h2>4. Adicione fotos de qualidade</h2>
          <p>Anúncios com fotos boas vendem muito mais rápido. Tire fotos em locais iluminados, mostrando diferentes ângulos do produto e possíveis detalhes de uso.</p>

          <h2>5. Defina um preço justo</h2>
          <p>Pesquise produtos similares na plataforma para ter uma ideia do preço de mercado. Um preço justo atrai mais compradores interessados.</p>

          <h2>6. Publique e acompanhe</h2>
          <p>Após revisar todas as informações, clique em publicar. Fique atento às mensagens no chat da plataforma, responda rápido aos interessados e boas vendas!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComoAnunciar;
