import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { getPublicationByIdService } from "~/features/post/postService";

// GET: /api/post/getByPostId?id=123
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

  // Obtener el ID del post desde los query params
  const url = new URL(request.url);
  const postId = url.searchParams.get("id");

  if (!postId) {
    return Response.json(
      {
        status: "error",
        message: "ID de publicación requerido",
      },
      { status: 400 }
    );
  }

  try {
    const publication = await getPublicationByIdService(
      parseInt(postId),
      cookie
    );

    return Response.json(
      {
        status: "success",
        publication,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al obtener publicación:", err);
    return Response.json(
      {
        status: "error",
        message: "Error al obtener publicación",
      },
      { status: 500 }
    );
  }
}

// POST: /api/post/getByPostId con body { id: 123 } o formData
export async function action({ request }: ActionFunctionArgs) {
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

  try {
    // Intentar obtener el ID desde formData o JSON
    let postId: string | null = null;

    const contentType = request.headers.get("content-type");
    console.log("[GET_BY_ID] Content-Type:", contentType);

    if (contentType?.includes("application/json")) {
      const body = await request.json();
      console.log("[GET_BY_ID] JSON body:", body);
      postId = body.id || body.id_publicacion;
    } else {
      // Es formData
      const formData = await request.formData();
      console.log(
        "[GET_BY_ID] FormData entries:",
        Object.fromEntries(formData.entries())
      );
      postId =
        formData.get("id")?.toString() ||
        formData.get("id_publicacion")?.toString() ||
        null;
    }

    console.log("[GET_BY_ID] Extracted postId:", postId);

    if (!postId) {
      return Response.json(
        {
          status: "error",
          message: "ID de publicación requerido",
        },
        { status: 400 }
      );
    }

    const postIdNumber = parseInt(postId);
    console.log("[GET_BY_ID] Calling service with ID:", postIdNumber);

    const publication = await getPublicationByIdService(postIdNumber, cookie);

    return Response.json(
      {
        status: "success",
        publication,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al obtener publicación:", err);
    return Response.json(
      {
        status: "error",
        message: "Error al obtener publicación",
      },
      { status: 500 }
    );
  }
}
