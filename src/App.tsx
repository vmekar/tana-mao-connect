import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ListingDetails from "./pages/ListingDetails";
import CreateListing from "./pages/CreateListing";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import MyAds from "./pages/MyAds";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";

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
            {/* Merge routes: Use main's /anunciar for CreateListing but keep my create-listing if needed, or unify */}
            {/* Main uses /anunciar, I used /create-listing. I'll support both or align with main. Let's align with main. */}
            <Route path="/anunciar" element={<CreateListing />} />
            <Route path="/create-listing" element={<CreateListing />} /> {/* Kept for backward compat */}
            <Route path="/listing/edit/:id" element={<CreateListing />} />
            <Route path="/search" element={<Search />} />
            <Route path="/my-ads" element={<MyAds />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
