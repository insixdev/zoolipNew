import { LoaderFunctionArgs } from "react-router";
import { getAllPublicationsService } from "~/features/post/postService";

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

  try {
    const publications = await getAllPublicationsService(cookie);

    return Response.json(
      {
        status: "success",
        publications,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al obtener publicaciones:", err);
    return Response.json(
      {
        status: "error",
        message: "Error al obtener publicaciones",
      },
      { status: 500 }
    );
  }
}
