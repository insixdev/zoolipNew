import { MessageCircle } from "lucide-react";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router";
import { HacerPregunta } from "~/components/community/consultas/HacerPregunta";
import { Pregunta } from "~/components/community/consultas/Pregunta";
import { AuthRoleComponent } from "~/components/auth/AuthRoleComponent";
import { USER_ROLES } from "~/lib/constants";
import { useSmartAuth } from "~/features/auth/useSmartAuth";
import { getAllPublicPublicationsService } from "~/features/post/postService";
import { postParseResponse } from "~/features/post/postResponseParse";

// Loader para obtener solo las consultas
export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return { consultas: [], isPublic: true };
  }

  try {
    const fetchedPosts = await getAllPublicPublicationsService(cookie);
    const allPosts = postParseResponse(fetchedPosts);

    // Filtrar solo consultas
    const consultasOnly = allPosts.filter(
      (post) => post.publicationType === "CONSULTA"
    );

    // Obtener el número de comentarios para cada consulta
    const { getCommentsByPublicationService } = await import(
      "~/features/post/comments/commentService"
    );

    const consultasWithCommentCount = await Promise.all(
      consultasOnly.map(async (consulta) => {
        try {
          const comments = await getCommentsByPublicationService(
            consulta.id,
            cookie
          );
          return { ...consulta, comments: comments.length };
        } catch (error) {
          console.error(
            `Error getting comments for consulta ${consulta.id}:`,
            error
          );
          return { ...consulta, comments: 0 };
        }
      })
    );

    return { consultas: consultasWithCommentCount };
  } catch (error) {
    console.error("Error loading consultas:", error);
    return { consultas: [] };
  }
}

export default function CommunityConsultas() {
  const { user } = useSmartAuth();
  const loaderData = useLoaderData<typeof loader>();
  const consultas = loaderData?.consultas ?? [];

  // Convertir posts a formato de consulta para el componente Pregunta
  const consultasFormateadas = consultas.map((consulta) => ({
    id: consulta.id.toString(),
    title: consulta.topico,
    content: consulta.content,
    author: consulta.author.username,
    avatar: consulta.author.avatar,
    timestamp: new Date(consulta.fecha_creacion).toLocaleDateString("es-ES"),
    responses: consulta.comments,
    likes: consulta.likes,
    category: consulta.topico,
  }));

  return (
    <div className="mx-auto max-w-7xl md:pl-64 px-4 pt-8 pb-10">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl mb-4 shadow-md">
          <MessageCircle className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Consultas de la Comunidad
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Haz preguntas y comparte conocimientos con otros amantes de los
          animales
        </p>
      </div>

      {/* Nueva consulta - Solo para usuarios autenticados */}
      <AuthRoleComponent
        allowedRoles={[
          USER_ROLES.ADMIN,
          USER_ROLES.ADOPTANTE,
          USER_ROLES.USER,
          USER_ROLES.SYSTEM,
          USER_ROLES.VETERINARIA,
          USER_ROLES.REFUGIO,
          USER_ROLES.PROTECTORA,
        ]}
        fallback={
          <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl shadow-md border border-orange-200 p-8 mb-8 text-center">
            <MessageCircle className="mx-auto text-rose-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Inicia sesión para hacer preguntas
            </h3>
            <p className="text-gray-600 mb-6">
              Únete a nuestra comunidad para compartir tus dudas y ayudar a
              otros
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 border-2 border-rose-500 text-rose-600 rounded-lg hover:bg-rose-50 transition-all font-semibold"
              >
                Registrarse
              </Link>
            </div>
          </div>
        }
      >
        <HacerPregunta />
      </AuthRoleComponent>

      {/* Lista de consultas */}

      {/* Lista de consultas */}

      {user && consultasFormateadas.length > 0 ? (
        <div className="space-y-8">
          {consultasFormateadas.map((consulta) => (
            <Pregunta key={consulta.id} {...consulta} />
          ))}
        </div>
      ) : (
        consultasFormateadas.length === 0 &&
        user && (
          <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl shadow-md text-black border border-orange-200 p-8 mb-8 text-center">
            <p>No hay consultas disponibles aún.</p>
            <p className="text-sm mt-2">
              ¡Sé el primero en hacer una pregunta!
            </p>
          </div>
        )
      )}

      {!user && (
        <div className="bg-gradient-to-br from-white to-rose-50 rounded-xl text-black shadow-sm p-8 mb-8 text-center">
          <p>Para ver las consultas debes iniciar sesión</p>
        </div>
      )}
    </div>
  );
}
