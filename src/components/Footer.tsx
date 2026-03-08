import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-sm text-muted-foreground">
              Conectando compradores e vendedores locais de forma segura e eficiente.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Para Você</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/como-anunciar" className="hover:text-primary transition-colors">Como Anunciar</Link></li>
              <li><Link to="/como-comprar" className="hover:text-primary transition-colors">Como Comprar</Link></li>
              <li><Link to="/regras-de-seguranca" className="hover:text-primary transition-colors">Regras de Segurança</Link></li>
              <li><Link to="/planos-e-precos" className="hover:text-primary transition-colors">Planos e Preços</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sobre-nos" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/carreiras" className="hover:text-primary transition-colors">Carreiras</Link></li>
              <li><Link to="/imprensa" className="hover:text-primary transition-colors">Imprensa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/central-de-ajuda" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/denunciar" className="hover:text-primary transition-colors">Denunciar</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>© 2025 TemRolo. Todos os direitos reservados.</p>
            <p className="hidden md:block">•</p>
            <a href="https://www.temrolo.com.br" className="hover:text-primary transition-colors font-medium">www.temrolo.com.br</a>
          </div>
          <div className="flex gap-6">
            <Link to="/termos-de-uso" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/termos-de-uso" className="hover:text-primary transition-colors">Termos</Link>
            <Link to="/termos-de-uso" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
