import { LoaderFunctionArgs } from "react-router";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "upload");

/**
 * Loader para servir imágenes desde /upload/{filename}
 * Ejemplo: GET /upload/1234567890-abc123.jpg
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const { filename } = params;

  if (!filename) {
    return new Response("Archivo no encontrado", { status: 404 });
  }

  try {
    const filePath = path.join(UPLOAD_DIR, filename);

    // Verificar que el archivo existe
    if (!existsSync(filePath)) {
      console.warn(
        `[UPLOAD LOADER] Archivo no encontrado: ${filePath}`
      );
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
      svg: "image/svg+xml",
      pdf: "application/pdf",
      txt: "text/plain",
    };

    const contentType =
      mimeTypes[extension || ""] || "application/octet-stream";

    console.log(
      `[UPLOAD LOADER] Sirviendo: ${filename} (${contentType}) - ${(fileBuffer.length / 1024).toFixed(2)} KB`
    );

    // Retornar el archivo con el tipo MIME correcto y cache headers
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error(
      `[UPLOAD LOADER] Error al leer archivo ${filename}:`,
      error
    );
    return new Response("Error al leer el archivo", { status: 500 });
  }
}
