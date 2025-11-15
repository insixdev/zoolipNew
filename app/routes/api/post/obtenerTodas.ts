import { LoaderFunctionArgs } from "react-router";
import { getPublicationsWithPaginationService } from "~/features/post/postService";
import { postParseResponse } from "~/features/post/postResponseParse";
import { getCommentsByPublicationService } from "~/features/post/comments/commentService";
import { decodeClaims } from "~/lib/authUtil";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    return Response.json(
      {
        status: "error",
        message: "No hay cookie de autenticación",
      },
      { status: 401 }
    );
  }

  // Extraer el token de la cookie
  const { getTokenFromCookie } = await import("~/server/cookies");
  const token = getTokenFromCookie(cookie);

  if (!token) {
    return Response.json(
      {
        status: "error",
        message: "No se encontró el token",
        code: "NO_TOKEN",
      },
      { status: 401 }
    );
  }

  // Validar que el token sea válido
  const tokenValidation = decodeClaims(token);
  console.log("[OBTENER TODAS] Token validation:", tokenValidation);

  if (!tokenValidation.valid) {
    console.log(
      "[OBTENER TODAS] Token inválido o expirado:",
      tokenValidation.error
    );
    return Response.json(
      {
        status: "error",
        message: "Token inválido o expirado",
        code: tokenValidation.code,
      },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const lastId = url.searchParams.get("lastId");

  try {
    // Si no hay lastId, el servicio usará 1 por defecto
    const startId = lastId ? parseInt(lastId) : 1;

    console.log(
      `[OBTENER TODAS] Fetching publications starting from ID: ${startId}`
    );

    const fetchedPosts = await getPublicationsWithPaginationService(
      startId,
      cookie
    );

    console.log(
      `[OBTENER TODAS] Fetched ${fetchedPosts.length} posts from backend`
    );

    const posts = postParseResponse(fetchedPosts);

    console.log(`[OBTENER TODAS] Parsed ${posts.length} posts`);

    // Obtener el número de comentarios para cada post
    const publications = await Promise.all(
      posts.map(async (post) => {
        try {
          const comments = await getCommentsByPublicationService(
            post.id,
            cookie
          );
          return { ...post, comments: comments.length };
        } catch (error) {
          console.error(
            `[OBTENER TODAS] Error getting comments for post ${post.id}:`,
            error
          );
          return { ...post, comments: 0 };
        }
      })
    );

    console.log(
      `[OBTENER TODAS] Returning ${publications.length} publications with comment counts`
    );

    return Response.json(
      {
        status: "success",
        publications,
        posts: publications, // Agregar también como 'posts' para compatibilidad
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[OBTENER TODAS] Error al obtener publicaciones:", err);

    // Si el error es por token inválido (403), devolver error especial
    if (err.message === "TOKEN_INVALID_403") {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Token inválido o expirado",
          code: "INVALID_TOKEN",
        }),
        {
          status: 401,
          headers: {
            "Set-Cookie":
              "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax",
          },
        }
      );
    }

    return Response.json(
      {
        status: "error",
        message: "Error al obtener publicaciones",
      },
      { status: 500 }
    );
  }
}
