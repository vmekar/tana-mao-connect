import { Link, useLocation } from "react-router-dom";
import { Home, Search, Plus, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
        >
          <Home className={cn("w-6 h-6", isActive("/") && "fill-current")} strokeWidth={isActive("/") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Início</span>
        </Link>

        <Link
          to="/search"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive("/search") ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
        >
          <Search className="w-6 h-6" strokeWidth={isActive("/search") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Buscar</span>
        </Link>

        <Link
          to="/anunciar"
          className="flex flex-col items-center justify-center w-full h-full -mt-5"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-6 h-6" strokeWidth={3} />
          </div>
          <span className="text-[10px] font-medium mt-1 text-muted-foreground">Anunciar</span>
        </Link>

        <Link
          to="/favorites"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive("/favorites") ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
        >
          <Heart className={cn("w-6 h-6", isActive("/favorites") && "fill-current")} strokeWidth={isActive("/favorites") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Favoritos</span>
        </Link>

        <Link
          to="/profile"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
            isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
        >
          <User className={cn("w-6 h-6", isActive("/profile") && "fill-current")} strokeWidth={isActive("/profile") ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </div>
    </div>
  );
};
