import { redirect } from "react-router";
import { createPublicationService } from "~/features/post/postService";
import { PublicationCreateRequest } from "~/features/post/types";
import { toLocalISOString } from "~/lib/generalUtil";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "upload");

// Asegurar que el directorio de uploads existe
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Procesar upload de imagen localmente
async function uploadImageFile(imagenFile: File): Promise<string | null> {
  if (!imagenFile || imagenFile.size === 0) {
    return null;
  }

  try {
    await ensureUploadDir();

    console.log(
      "[CREATE POST] Procesando imagen localmente:",
      imagenFile.name,
      `(${(imagenFile.size / 1024).toFixed(2)} KB)`
    );

    // Validar tamaño (máximo 5MB)
    if (imagenFile.size > 5 * 1024 * 1024) {
      console.error("[CREATE POST] Archivo muy grande");
      return null;
    }

    // Generar nombre único
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = imagenFile.name.split(".").pop() || "jpg";
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Guardar archivo
    const arrayBuffer = await imagenFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    const fileUrl = `/upload/${fileName}`;
    console.log("[CREATE POST] Imagen guardada localmente:", fileUrl);
    return fileUrl;
  } catch (err) {
    console.error("[CREATE POST] Error al guardar imagen:", err);
    return null;
  }
}

//action para crear post con soporte para imagen_file en memoria
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

  const formData = await request.formData();
  
  // Procesar imagen_file si existe (archivo en multipart del cliente)
  let imagenUrl = formData.get("imagen_url")?.toString() || "";
  const imagenFile = formData.get("imagen_file") as File | null;

  // Si hay archivo imagen_file, procesar localmente
  if (imagenFile && imagenFile.size > 0) {
    const uploadedUrl = await uploadImageFile(imagenFile);
    if (uploadedUrl) {
      imagenUrl = uploadedUrl;
    }
    // Si falla el upload, continuar sin imagen (no bloquear el post)
  }

  // Crear objeto de datos para validación
  const dataObj: Record<string, any> = {
    topico: formData.get("topico"),
    contenido: formData.get("contenido"),
    tipo: formData.get("tipo"),
    imagen_url: imagenUrl,
  };

  console.log("[CREATE POST] Datos procesados del formulario:", {
    topico: dataObj.topico,
    contenido: dataObj.contenido?.toString().substring(0, 50),
    tipo: dataObj.tipo,
    imagen_url: dataObj.imagen_url,
    tiene_imagen: !!dataObj.imagen_url,
  });

  const postValidation = postBasicValidation(dataObj);

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
    "[CREATE POST] Post validado correctamente, imagen_file:",
    imagenFile?.name
  );

  const now = toLocalISOString(new Date(Date.now()));

  const isConsulta = postValidation.post.tipo === "CONSULTA";

  // Usar la imagen convertida a base64 si existe, sino usar imagen_url
  const finalImagenUrl =
    !isConsulta && postValidation.post.imagen_url && postValidation.post.imagen_url.trim() !== ""
      ? postValidation.post.imagen_url
      : null;

  const postRequest: PublicationCreateRequest = {
    // id_usuario se obtiene del backend desde la cookie, no se envía
    topico: postValidation.post.topico || "General",
    contenido: postValidation.post.contenido,
    likes: 0,
    // Incluir imagen_url (que puede ser base64 o URL)
    imagen_url: finalImagenUrl,
    // Solo incluir fecha_pregunta si ES una consulta
    fecha_pregunta: now,
    fecha_edicion: "",
    fecha_duda_resuelta: "",
    tipo: postValidation.post.tipo,
  };

  console.log("[CREATE POST] Enviando al backend:", {
    topico: postRequest.topico,
    tipo: postRequest.tipo,
    imagen_url_length: postRequest.imagen_url?.length || 0,
    contenido_length: postRequest.contenido.length,
    con_imagen: !!postRequest.imagen_url,
  });

  try {
    const postRes = await createPublicationService(postRequest, cookie);
    console.log("[CREATE POST] Respuesta del backend:", postRes);

    return Response.json(
      { status: "success", message: "Publicación creada con éxito" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CREATE POST] Error al crear publicacion:", err);
    if (err === "Token invalidado") {
      return redirect("/login", {
        headers: {
          "Set-Cookie":
            "token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
        },
      });
    }
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