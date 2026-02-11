import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, User, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-3xl">🤝</div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TanaMão
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost">Categorias</Button>
            <Button variant="ghost">Como Funciona</Button>
            <Button variant="ghost">Ajuda</Button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <MessageCircle className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getInitials(user.email || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center gap-2 text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="default" className="hidden md:flex" asChild>
                  <Link to="/anunciar">Anunciar Grátis</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden md:flex">
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button variant="default" asChild className="hidden md:flex">
                  <Link to="/auth">Cadastrar</Link>
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
