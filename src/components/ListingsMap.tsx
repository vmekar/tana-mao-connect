import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Listing } from "@/types/listing";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

// Leaflet Icon Fix
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ListingsMapProps {
  listings: Listing[];
}

interface ListingWithCoords extends Listing {
  coords: [number, number];
}

function FitBounds({ markers }: { markers: ListingWithCoords[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const group = L.featureGroup(markers.map((m) => L.marker(m.coords)));
      map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 14 });
    }
  }, [markers, map]);

  return null;
}

export const ListingsMap = ({ listings }: ListingsMapProps) => {
  const [markers, setMarkers] = useState<ListingWithCoords[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true);
      const newMarkers: ListingWithCoords[] = [];
      const cache: Record<string, [number, number]> = {};

      const validListings = listings.filter((l) => l.location && l.location.length > 3);

      for (const listing of validListings) {
        if (cache[listing.location]) {
          const [lat, lon] = cache[listing.location];
          const jitterLat = (Math.random() - 0.5) * 0.005;
          const jitterLon = (Math.random() - 0.5) * 0.005;
          newMarkers.push({ ...listing, coords: [lat + jitterLat, lon + jitterLon] });
          continue;
        }

        try {
          // Delay to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 300));

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              listing.location
            )}&limit=1`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            cache[listing.location] = [lat, lon];

            const jitterLat = (Math.random() - 0.5) * 0.002;
            const jitterLon = (Math.random() - 0.5) * 0.002;

            newMarkers.push({ ...listing, coords: [lat + jitterLat, lon + jitterLon] });
          }
        } catch (error) {
          console.error(`Failed to geocode ${listing.location}`, error);
        }
      }
      setMarkers(newMarkers);
      setLoading(false);
    };

    if (listings.length > 0) {
      fetchCoordinates();
    }
  }, [listings]);

  if (loading && markers.length === 0) {
    return (
      <div className="h-full w-full bg-muted/20 animate-pulse flex flex-col items-center justify-center text-muted-foreground gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span>Carregando mapa e localizações...</span>
      </div>
    );
  }

  // Default center
  const center: [number, number] = markers.length > 0 ? markers[0].coords : [-14.235, -51.9253];
  const zoom = markers.length > 0 ? 13 : 4;

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.coords}>
            <Popup className="min-w-[200px]">
              <div className="flex gap-3">
                <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-muted">
                  <img
                    src={marker.images[0] || "/placeholder.svg"}
                    alt={marker.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1 truncate">
                      {marker.title}
                    </h3>
                    <span className="text-primary font-bold text-sm">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(marker.price)}
                    </span>
                  </div>
                  <Button size="sm" variant="link" className="h-auto p-0 justify-start text-xs" asChild>
                    <Link to={`/listing/${marker.id}`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitBounds markers={markers} />
      </MapContainer>
    </div>
  );
};
