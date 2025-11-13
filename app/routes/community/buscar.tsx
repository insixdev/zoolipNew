// Página de búsqueda de la comunidad
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useState, useMemo } from "react";
import { BarraBusqueda } from "~/components/community/buscar/BarraBusqueda";
import { ResultadoBusqueda } from "~/components/community/buscar/ResultadoBusqueda";
import { TrendingSidebar } from "~/components/community/shared/TrendingSidebar";
import { requireAuth } from "~/lib/authGuard";
import { usePostSearch } from "~/hooks/usePostSearch";
import { Loader2 } from "lucide-react";

// Loader para verificar autenticacion y obtener token
export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);

  // Obtener el token de las cookies del request
  const cookieHeader = request.headers.get("Cookie");
  let token = null;

  if (cookieHeader) {
    const cookies = cookieHeader.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "AUTH_TOKEN") {
        token = value;
        break;
      }
    }
  }

  return { token };
}

export default function CommunityBuscar() {
  const { token } = useLoaderData<typeof loader>();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    postResults,
    userResults: rawUserResults,
    isSearching,
    error,
    search,
    isConnected,
  } = usePostSearch(token);

  // Formatear usuarios del WebSocket
  const userResults = useMemo(() => {
    return rawUserResults.map((user: any) => ({
      id: user.id || user.id_usuario,
      type: "user" as const,
      name: user.nombre || user.username,
      username: `@${user.username}`,
      avatar: `https://i.pravatar.cc/150?img=${user.id || 1}`,
      followers: "0",
      isFollowing: false,
      bio: user.email || "",
      role: user.role || user.rol,
    }));
  }, [rawUserResults]);

  // Convertir los posts del WebSocket al formato de ResultadoBusqueda
  const formattedPostResults = useMemo(() => {
    return postResults.map((post) => ({
      id: String(post.id_publicacion || post.idPublicacion || 0),
      type: "post" as const,
      author: post.nombreUsuario || "Usuario",
      username: `@${post.nombreUsuario || "usuario"}`,
      avatar: `https://i.pravatar.cc/150?img=${post.id_publicacion || post.idPublicacion || 1}`,
      content: post.contenido,
      topico: post.topico,
      likes: post.likes || 0,
      comments: 0,
      timestamp: formatTimestamp(
        post.fecha_pregunta || post.fechaPregunta || ""
      ),
    }));
  }, [postResults]);

  // Combinar resultados de posts y usuarios
  const allResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    // Filtrar usuarios que coincidan con la búsqueda
    const filteredUsers = userResults.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Combinar posts del WebSocket con usuarios filtrados
    // Agregar prefijo al id para evitar colisiones
    const postsWithPrefix = formattedPostResults.map((post) => ({
      ...post,
      id: `post-${post.id}`,
    }));

    const usersWithPrefix = filteredUsers.map((user) => ({
      ...user,
      id: `user-${user.id}`,
    }));

    return [...postsWithPrefix, ...usersWithPrefix];
  }, [searchQuery, formattedPostResults, userResults]);

  const trendingTopics = [
    { tag: "#AdopcionResponsable", posts: "2.1k" },
    { tag: "#CuidadoVeterinario", posts: "1.8k" },
    { tag: "#EntrenamientoCanino", posts: "1.5k" },
    { tag: "#GatosRescatados", posts: "1.2k" },
    { tag: "#ConsejosVet", posts: "980" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query); // Buscar posts Y usuarios por WebSocket
    }
  };

  return (
    <div className="w-full mx-auto md:pl-72 px-6 pt-6 pb-10 pr-12">
      {/* Barra de búsqueda */}
      <BarraBusqueda onSearch={handleSearch} />

      {/* Estado de conexión */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-200">
          Conectando al servidor de búsqueda...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* Resultados principales */}
        <div className="xl:col-span-3 space-y-6 max-w-2xl">
          {isSearching && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-rose-500" size={32} />
              <span className="ml-3 text-gray-600">Buscando...</span>
            </div>
          )}

          {!isSearching && searchQuery && allResults.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No se encontraron resultados</p>
              <p className="text-sm mt-2">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}

          {!isSearching && !searchQuery && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Busca publicaciones y usuarios</p>
              <p className="text-sm mt-2">
                Escribe algo en la barra de búsqueda
              </p>
            </div>
          )}

          {!isSearching && allResults.length > 0 && (
            <>
              <div className="text-sm text-gray-600 mb-4">
                {allResults.length} resultado
                {allResults.length !== 1 ? "s" : ""} encontrado
                {allResults.length !== 1 ? "s" : ""}
              </div>
              {allResults.map((result) => (
                <ResultadoBusqueda key={result.id} result={result} />
              ))}
            </>
          )}
        </div>

        {/* Sidebar con tendencias */}
        <div className="xl:col-span-2">
          <TrendingSidebar trendingTopics={trendingTopics} />
        </div>
      </div>
    </div>
  );
}

// Helper para formatear timestamp
function formatTimestamp(dateString: string): string {
  if (!dateString) return "Hace un momento";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  } catch {
    return "Hace un momento";
  }
}
