import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ListingDetails from "./pages/ListingDetails";
import CreateListing from "./pages/CreateListing";
import Search from "./pages/Search";
import MyAds from "./pages/MyAds";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import Favorites from "./pages/Favorites";
import { BottomNav } from "@/components/BottomNav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ComoAnunciar from "./pages/ComoAnunciar";
import ComoComprar from "./pages/ComoComprar";
import RegrasSeguranca from "./pages/RegrasSeguranca";
import PlanosPrecos from "./pages/PlanosPrecos";
import SobreNos from "./pages/SobreNos";
import Blog from "./pages/Blog";
import Carreiras from "./pages/Carreiras";
import Imprensa from "./pages/Imprensa";
import CentralAjuda from "./pages/CentralAjuda";
import Contato from "./pages/Contato";
import Denunciar from "./pages/Denunciar";
import TermosUso from "./pages/TermosUso";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/listing/:id" element={<ListingDetails />} />

            {/* Protected Routes */}
            <Route
              path="/novo-anuncio"
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listing/edit/:id"
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-ads"
              element={
                <ProtectedRoute>
                  <MyAds />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            <Route path="/search" element={<Search />} />
            <Route path="/como-anunciar" element={<ComoAnunciar />} />
            <Route path="/como-comprar" element={<ComoComprar />} />
            <Route path="/regras-de-seguranca" element={<RegrasSeguranca />} />
            <Route path="/planos-e-precos" element={<PlanosPrecos />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/carreiras" element={<Carreiras />} />
            <Route path="/imprensa" element={<Imprensa />} />
            <Route path="/central-de-ajuda" element={<CentralAjuda />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/denunciar" element={<Denunciar />} />
            <Route path="/termos-de-uso" element={<TermosUso />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
