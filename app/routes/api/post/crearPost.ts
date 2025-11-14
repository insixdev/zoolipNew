import { createPublicationService } from "~/features/post/postService";
import { PublicationCreateRequest, UserIdPost } from "~/features/post/types";
import {
  field,
  getUserFieldFromCookie,
  getUserIdFromToken,
} from "~/lib/authUtil";
import { toLocalISOString } from "~/lib/generalUtil";

//action para crear post
export async function action({ request }) {
  const cookie = request.headers.get("Cookie");

  if (!cookie) {
    console.error("No cookie found");
    return Response.json(
      {
        status: "error",
        message: "No autenticado",
      },
      { status: 401 }
    );
  }

  const userIdFormCookie = getUserFieldFromCookie(cookie, "id_usuario");
  console.log("userIdFormCookie:", userIdFormCookie);

  if (!userIdFormCookie) {
    console.error("No user ID in cookie");
    return Response.json(
      {
        status: "error",
        message: "Usuario no encontrado",
      },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log("Form data received:", data);

  const postValidation = postBasicValidation(data);

  if (!postValidation.post) {
    console.error("Validation failed:", postValidation.message);
    return Response.json(
      {
        status: postValidation.status,
        message: postValidation.message,
      },
      { status: 400 }
    );
  }
  console.log("Post validated successfully");

  const id: UserIdPost = {
    id: Number(userIdFormCookie),
  };

  const now = toLocalISOString(new Date(Date.now()));

  const isConsulta = postValidation.post.tipo === "CONSULTA";

  const postRequest: PublicationCreateRequest = {
    id_usuario: id,
    topico: postValidation.post.topico || "General",
    contenido: postValidation.post.contenido,
    likes: 0,
    // Solo incluir imagen_url si NO es una consulta
    imagen_url: isConsulta ? null : "",
    // Solo incluir fecha_pregunta si ES una consulta
    fecha_pregunta: isConsulta ? now : "",
    fecha_edicion: "",
    fecha_duda_resuelta: "",
    tipo: postValidation.post.tipo,
  };

  console.log("Creating post with data:", postRequest);
  console.log(
    `[CREATE POST] Tipo: ${postRequest.tipo}, fecha_pregunta: ${postRequest.fecha_pregunta}`
  );

  try {
    const postRes = await createPublicationService(postRequest, cookie);
    console.log("Post created successfully:", postRes);

    return Response.json(
      { status: "success", message: "Publicación creada con éxito" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error creating post:", err);
    return Response.json(
      { status: "error", message: `Error al crear publicación: ${err}` },
      { status: 500 }
    );
  }
}
function postBasicValidation(data) {
  if (!data) {
    return {
      status: "error",
      message: "No hay datos",
    };
  }

  try {
    const postData = data as any;
    console.log("Validating post data:", postData);

    // Validar que tenga contenido
    if (!postData.contenido || postData.contenido.trim().length === 0) {
      return {
        status: "error",
        message: "El contenido no puede estar vacío",
      };
    }

    // El topico es opcional, pero si está vacío usar "General"
    const validatedPost = {
      topico:
        postData.topico && postData.topico.trim().length > 0
          ? postData.topico
          : "General",
      contenido: postData.contenido.trim(),
      likes: 0,
      tipo: postData.tipo || "PUBLICACION",
    };

    return {
      status: "success",
      message: "Post validado con éxito",
      post: validatedPost,
    };
  } catch (err) {
    console.error("Validation error:", err);
    return {
      status: "error",
      message: `Error al procesar los datos: ${err}`,
    };
  }
}

export async function loader() {
  return Response.json({ message: "Método no permitido" }, { status: 405 });
}
