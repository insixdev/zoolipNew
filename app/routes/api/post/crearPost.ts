import { createPublicationService } from "~/features/post/postService";
import { PublicationCreateRequest, UserIdPost } from "~/features/post/types";
import { getUserFieldFromCookie } from "~/lib/authUtil";
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
  console.log("[CREATE POST] Datos recibidos del formulario:", {
    topico: data.topico,
    contenido: data.contenido?.toString().substring(0, 50),
    tipo: data.tipo,
    imagen_url: data.imagen_url,
  });

  const postValidation = postBasicValidation(data);

  if (!postValidation.post) {
    console.error("[CREATE POST] Validacion fallida:", postValidation.message);
    return Response.json(
      {
        status: postValidation.status,
        message: postValidation.message,
      },
      { status: 400 }
    );
  }
  console.log(
    "[CREATE POST] Post validado correctamente, imagen_url:",
    postValidation.post.imagen_url
  );

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
    // Solo incluir imagen_url si NO es una consulta Y si existe una URL válida
    imagen_url: isConsulta
      ? null
      : postValidation.post.imagen_url &&
          postValidation.post.imagen_url.trim() !== ""
        ? postValidation.post.imagen_url
        : null,
    // Solo incluir fecha_pregunta si ES una consulta
    fecha_pregunta: isConsulta ? now : "",
    fecha_edicion: "",
    fecha_duda_resuelta: "",
    tipo: postValidation.post.tipo,
  };

  console.log("[CREATE POST] Enviando al backend:", {
    id_usuario: postRequest.id_usuario,
    topico: postRequest.topico,
    tipo: postRequest.tipo,
    imagen_url: postRequest.imagen_url,
    imagen_url_length: postRequest.imagen_url?.length || 0,
    contenido_length: postRequest.contenido.length,
  });
  console.log(
    "[CREATE POST] JSON completo:",
    JSON.stringify(postRequest, null, 2)
  );

  try {
    const postRes = await createPublicationService(postRequest, cookie);
    console.log("[CREATE POST] Respuesta del backend:", postRes);

    return Response.json(
      { status: "success", message: "Publicación creada con éxito" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CREATE POST] Error al crear publicacion:", err);
    return Response.json(
      { status: "error", message: `Error al crear publicación: ${err}` },
      { status: 500 }
    );
  }
}
function postBasicValidation(data: any) {
  if (!data) {
    return {
      status: "error",
      message: "No hay datos",
    };
  }

  try {
    const postData = data as any;

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
      imagen_url: postData.imagen_url || "",
    };

    console.log("[VALIDATION] Post validado:", {
      topico: validatedPost.topico,
      tipo: validatedPost.tipo,
      tiene_imagen: !!validatedPost.imagen_url,
      imagen_url: validatedPost.imagen_url,
    });

    return {
      status: "success",
      message: "Post validado con éxito",
      post: validatedPost,
    };
  } catch (err) {
    console.error("[VALIDATION] Error:", err);
    return {
      status: "error",
      message: `Error al procesar los datos: ${err}`,
    };
  }
}

export async function loader() {
  return Response.json({ message: "Método no permitido" }, { status: 405 });
}
