import { LoaderFunctionArgs } from "react-router";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function loader({ params }: LoaderFunctionArgs) {
  const { filename } = params;

  if (!filename) {
    return new Response("Archivo no encontrado", { status: 404 });
  }

  try {
    const filePath = path.join(UPLOAD_DIR, filename);

    // Verificar que el archivo existe
    if (!existsSync(filePath)) {
      return new Response("Archivo no encontrado", { status: 404 });
    }

    // Leer el archivo
    const fileBuffer = await readFile(filePath);

    // Determinar el tipo MIME basado en la extensión
    const extension = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      pdf: "application/pdf",
      txt: "text/plain",
    };

    const contentType =
      mimeTypes[extension || ""] || "application/octet-stream";

    // Retornar el archivo con el tipo MIME correcto
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Error al leer el archivo", { status: 500 });
  }
}
