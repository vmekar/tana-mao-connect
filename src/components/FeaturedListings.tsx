import { ListingCard } from "./ListingCard";

// Mock data - will be replaced with real API data
const mockListings = [
  {
    id: "1",
    title: "iPhone 14 Pro Max 256GB - Estado de Novo",
    price: 4500,
    image: "https://images.unsplash.com/photo-1678911820864-e5c3100957ae?w=800&q=80",
    location: "Pinheiros, SP",
    timeAgo: "2h",
    isFeatured: true,
  },
  {
    id: "2",
    title: "MacBook Air M2 2023 - 8GB 256GB",
    price: 6800,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    location: "Vila Madalena, SP",
    timeAgo: "5h",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Sofá 3 Lugares Retrátil - Cinza",
    price: 1200,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    location: "Perdizes, SP",
    timeAgo: "1d",
  },
  {
    id: "4",
    title: "Bicicleta Speed Caloi 10 - Aro 29",
    price: 850,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    location: "Jardins, SP",
    timeAgo: "3h",
  },
  {
    id: "5",
    title: "PlayStation 5 + 2 Controles + 3 Jogos",
    price: 3200,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    location: "Pinheiros, SP",
    timeAgo: "6h",
    isFeatured: true,
  },
  {
    id: "6",
    title: "Mesa de Escritório com Gavetas - Madeira",
    price: 450,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
    location: "Vila Madalena, SP",
    timeAgo: "12h",
  },
  {
    id: "7",
    title: "Smart TV 55' 4K Samsung QLED",
    price: 2800,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
    location: "Perdizes, SP",
    timeAgo: "8h",
  },
  {
    id: "8",
    title: "Câmera Canon EOS R6 + Lente 24-70mm",
    price: 12500,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    location: "Jardins, SP",
    timeAgo: "1d",
  },
];

export const FeaturedListings = () => {
  return (
    <section className="container mx-auto px-4 py-16 bg-muted/30">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Anúncios em Destaque
      </h2>
      <p className="text-center text-muted-foreground mb-12">
        As melhores ofertas perto de você
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockListings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
};
