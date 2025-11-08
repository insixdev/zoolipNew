import type { LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";
import { FavoritoCard } from "~/components/adopt/favoritos/FavoritoCard";
import { EstadisticasFavoritos } from "~/components/adopt/favoritos/EstadisticasFavoritos";
import { EmptyFavoritosState } from "~/components/adopt/favoritos/EmptyFavoritosState";
import { ConsejosFavoritos } from "~/components/adopt/favoritos/ConsejosFavoritos";

// Loader para verificar autenticación
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

export default function AdoptFavoritos() {
  const favoritePets = [
    {
      id: "luna",
      name: "Luna",
      age: "1 año",
      breed: "Golden Retriever",
      gender: "Hembra",
      location: "Guadalajara, Jalisco",
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Muy tranquila y perfecta para familias con niños",
      refugio: "Refugio Esperanza",
      dateAdded: "2024-01-20",
      status: "available",
      urgency: "normal",
    },
    {
      id: "max",
      name: "Max",
      age: "2 años",
      breed: "Labrador Mix",
      gender: "Macho",
      location: "Ciudad de México",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Perro muy cariñoso y juguetón, ideal para familias activas",
      refugio: "Patitas Felices",
      dateAdded: "2024-01-18",
      status: "available",
      urgency: "high",
    },
    {
      id: "mia",
      name: "Mía",
      age: "2 años",
      breed: "Husky Siberiano",
      gender: "Hembra",
      location: "Querétaro",
      image:
        "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Activa y aventurera, necesita mucho ejercicio",
      refugio: "Amor Animal",
      dateAdded: "2024-01-15",
      status: "adopted",
      urgency: "normal",
    },
    {
      id: "rocky",
      name: "Rocky",
      age: "3 años",
      breed: "Pastor Alemán",
      gender: "Macho",
      location: "Monterrey, Nuevo León",
      image:
        "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Guardián leal y protector, excelente con niños",
      refugio: "Rescate Norte",
      dateAdded: "2024-01-12",
      status: "pending",
      urgency: "normal",
    },
  ];

  return (
    <div className="ml-64 px-8 py-4 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl from-orange-400    ">Favoritos</h1>
        </div>

        {/* Filtros y estadísticas */}
        <EstadisticasFavoritos pets={favoritePets} />

        {/* Grid de mascotas favoritas */}
        {favoritePets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePets.map((pet) => (
              <FavoritoCard key={pet.id} {...pet} />
            ))}
          </div>
        ) : (
          <EmptyFavoritosState />
        )}

        {/* Consejos */}
        {favoritePets.length > 0 && <ConsejosFavoritos />}
      </div>
    </div>
  );
}
