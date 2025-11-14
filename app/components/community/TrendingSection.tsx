import { Link } from "react-router";
import { TrendingSidebar } from "~/components/community/shared/TrendingSidebar";

type Post = {
  id: number;
  topico: string;
  [key: string]: any;
};

type TrendingSectionProps = {
  posts?: Post[];
  isPublic?: boolean;
};

/*
 * TrendingSection component
 * Muestra los tópicos más populares extraídos de las publicaciones
 * Solo se muestra si el usuario está autenticado
 * @returns {JSX.Element | null}
 */
export default function TrendingSection({
  posts = [],
  isPublic = false,
}: TrendingSectionProps) {
  // No mostrar nada si es acceso público (sin autenticación)
  if (isPublic) {
    return null;
  }

  // Extraer y contar tópicos de los posts
  const topicCounts = posts.reduce(
    (acc, post) => {
      if (post.topico) {
        const topic = post.topico.startsWith("#")
          ? post.topico
          : `#${post.topico}`;
        acc[topic] = (acc[topic] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Convertir a array y ordenar por cantidad de posts
  const trendingTopics = Object.entries(topicCounts)
    .map(([tag, count]) => ({
      tag,
      posts: count,
    }))
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 5); // Top 5 tópicos

  // Si no hay tópicos, no mostrar la sección
  if (trendingTopics.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col">
      {/* Contenedor principal con scroll */}
      <div className="flex-1 overflow-y-auto pl-6 pr-2 scrollbar-hide">
        {/* Sección de Tópicos - Fija en la parte superior */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm mb-3">
          <div className="px-4 py-2.5">
            <h3 className="text-sm font-semibold text-rose-700 text-center tracking-wide">
              Tópicos populares
            </h3>
          </div>
        </div>

        <TrendingSidebar trendingTopics={trendingTopics} />

        {/* Enlaces de interés - Ahora es parte del flujo normal */}
        <div className="mt-4 text-xs text-gray-400 space-y-2 px-2 py-4">
          <div className="flex flex-wrap gap-x-3 justify-center">
            <Link
              to="/info/terminos"
              className="hover:text-rose-600 transition-colors"
            >
              Términos
            </Link>
            <Link
              to="/info/privacidad"
              className="hover:text-rose-600 transition-colors"
            >
              Privacidad
            </Link>
            <Link
              to="/info/cookies"
              className="hover:text-rose-600 transition-colors"
            >
              Cookies
            </Link>
          </div>
          <p className="text-center text-gray-400">© 2025 Zoolip</p>
        </div>
      </div>
    </div>
  );
}
