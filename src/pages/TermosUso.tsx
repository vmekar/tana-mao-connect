import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TermosUso = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-3xl mx-auto">
          <h1>Termos de Uso e Política de Privacidade</h1>
          <p className="lead">Última atualização: Março de 2025</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar a plataforma TemRolo, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concorda com qualquer parte destes termos, você não deve usar nossos serviços.</p>

          <h2>2. Serviços da Plataforma</h2>
          <p>O TemRolo é uma plataforma de anúncios classificados que conecta compradores e vendedores locais. Não participamos das transações entre as partes, não intermediamos pagamentos nem garantimos a veracidade ou qualidade dos itens anunciados.</p>

          <h2>3. Conduta do Usuário</h2>
          <p>Você é o único responsável pelo conteúdo (textos, imagens) que publicar. É proibido anunciar produtos ilegais, falsificados, ou conteúdo que viole direitos de terceiros, seja ofensivo ou constitua fraude.</p>

          <h2>4. Privacidade e Dados Pessoais</h2>
          <p>Coletamos dados pessoais estritamente necessários para a criação de conta e funcionamento da plataforma (como nome, email e localização aproximada). Não vendemos seus dados para terceiros. Você pode solicitar a exclusão da sua conta e dados a qualquer momento.</p>

          <h2>5. Isenção de Responsabilidade</h2>
          <p>O TemRolo não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou consequentes resultantes do uso da plataforma, transações com outros usuários ou interrupção do serviço.</p>

          <h2>6. Modificações dos Termos</h2>
          <p>Podemos revisar e atualizar estes Termos periodicamente. O uso contínuo da plataforma após a publicação de alterações constitui sua aceitação dos novos Termos.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermosUso;
