import { BarraBusqueda } from "~/components/community/buscar/BarraBusqueda";
import { ResultadoBusqueda } from "~/components/community/buscar/ResultadoBusqueda";
import { TrendingSidebar } from "~/components/community/shared/TrendingSidebar";

export default function CommunityBuscar() {
  const searchResults = [
    {
      id: "1",
      type: "user" as const,
      name: "María González",
      username: "@maria_pets",
      avatar: "https://i.pravatar.cc/150?img=1",
      followers: "2.5k",
      isFollowing: false,
      bio: "Amante de los Golden Retrievers 🐕",
    },
    {
      id: "2",
      type: "post" as const,
      author: "Carlos Veterinario",
      username: "@dr_carlos",
      avatar: "https://i.pravatar.cc/150?img=12",
      content: "Consejos importantes para la vacunación de cachorros",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      likes: 124,
      comments: 23,
      timestamp: "2h",
    },
    {
      id: "3",
      type: "user" as const,
      name: "Refugio Esperanza",
      username: "@refugio_esperanza",
      avatar: "https://i.pravatar.cc/150?img=20",
      followers: "15.2k",
      isFollowing: true,
      bio: "Refugio de animales • Adopciones responsables",
    },
    {
      id: "4",
      type: "post" as const,
      author: "Ana Silva",
      username: "@ana_cats",
      avatar: "https://i.pravatar.cc/150?img=5",
      content: "Mi gato Luna aprendió un nuevo truco! 🐱",
      image:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      likes: 89,
      comments: 12,
      timestamp: "4h",
    },
  ];

  const trendingTopics = [
    { tag: "#AdopcionResponsable", posts: "2.1k" },
    { tag: "#CuidadoVeterinario", posts: "1.8k" },
    { tag: "#EntrenamientoCanino", posts: "1.5k" },
    { tag: "#GatosRescatados", posts: "1.2k" },
    { tag: "#ConsejosVet", posts: "980" },
  ];

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      {/* Barra de búsqueda */}
      <BarraBusqueda />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Resultados principales */}
        <div className="xl:col-span-3 space-y-6 max-w-2xl">
          {searchResults.map((result) => (
            <ResultadoBusqueda key={result.id} result={result} />
          ))}
        </div>

        {/* Sidebar con tendencias */}
        <div className="xl:col-span-2">
          <TrendingSidebar trendingTopics={trendingTopics} />
        </div>
      </div>
    </div>
  );
}
