import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CentralAjuda = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-3xl mx-auto mb-8">
          <h1>Central de Ajuda</h1>
          <p className="lead">Encontre respostas para as dúvidas mais comuns.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Como faço para anunciar grátis?</AccordionTrigger>
              <AccordionContent>
                Para anunciar gratuitamente, primeiro você precisa criar uma conta. Depois de entrar, clique no botão "Anunciar Grátis" no canto superior direito, preencha os detalhes do seu produto, adicione fotos e publique.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Como editar meu anúncio?</AccordionTrigger>
              <AccordionContent>
                Acesse "Meus Anúncios" no menu do seu perfil. Localize o anúncio que deseja alterar e clique em "Editar". Faça as alterações e salve.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Esqueci minha senha. E agora?</AccordionTrigger>
              <AccordionContent>
                Na página de login, clique em "Esqueci minha senha". Enviaremos um email com as instruções para redefinir sua senha.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Como excluir minha conta?</AccordionTrigger>
              <AccordionContent>
                No momento, a exclusão de conta deve ser solicitada através da página de Contato. Envie-nos uma mensagem e processaremos sua solicitação em até 7 dias úteis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Dicas para comprar com segurança</AccordionTrigger>
              <AccordionContent>
                Sempre desconfie de ofertas muito boas e exija ver o produto antes de pagar. Para mais dicas, acesse nossa página de "Regras de Segurança".
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CentralAjuda;
