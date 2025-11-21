import { ActionFunctionArgs } from "react-router";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getHeaderCookie } from "~/server/cookies";

const UPLOAD_DIR = path.join(process.cwd(), "public", "upload");

// Asegurar que el directorio de uploads existe
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const cookie = getHeaderCookie(request);

  if (!cookie) {
    return Response.json(
      {
        status: "error",
        message: "No hay sesión activa",
      },
      { status: 401 }
    );
  }

  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get("file");

    console.log("[UPLOAD API] FormData keys:", Array.from(formData.keys()));
    console.log("[UPLOAD API] File received:", file);
    console.log("[UPLOAD API] File type:", typeof file);
    console.log("[UPLOAD API] Is File?:", file instanceof File);

    if (!file || typeof file === "string") {
      return Response.json(
        {
          status: "error",
          message: "No se proporcionó ningún archivo válido",
        },
        { status: 400 }
      );
    }

    const fileObj = file as File;
    console.log("[UPLOAD API] File name:", fileObj.name);
    console.log("[UPLOAD API] File size:", fileObj.size);

    // Validar tamaño (máximo 5MB)
    if (fileObj.size > 5 * 1024 * 1024) {
      return Response.json(
        { status: "error", message: "Archivo muy grande. Máximo 5MB" },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = fileObj.name.split(".").pop() || "jpg";
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    console.log("[UPLOAD API] Saving to:", filePath);

    // Convertir el archivo a buffer y guardarlo
    const arrayBuffer = await fileObj.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // URL pública completa del archivo
    const origin = request.headers.get("origin") || request.headers.get("referer")?.split("/").slice(0, 3).join("/") || "http://localhost:5173";
    const fileUrl = `${origin}/upload/${fileName}`;

    console.log("[UPLOAD API] File saved successfully:", fileUrl);

    return Response.json(
      {
        status: "success",
        message: "Archivo subido exitosamente",
        data: {
          fileName,
          fileUrl,
          fileSize: fileObj.size,
          fileType: fileObj.type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Error al subir el archivo",
      },
      { status: 500 }
    );
  }
}
