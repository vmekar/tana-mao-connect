import { Header } from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import { NavigationPills } from "@/components/NavigationPills";
import { HorizontalAdList } from "@/components/HorizontalAdList";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroCarousel />
        <NavigationPills />
        <HorizontalAdList />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
