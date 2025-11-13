// //acciones globales para usuarios
// //se usan para obtener informacion de la base de datos
//
// import { UserRequest } from "../entities/User";
//
// const BASE_AUTH_URL = process.env.BASE_AUTH_URL || "http://localhost:3050/api/auth/";
// //tipo crud create read update delete
// export function registerAdmin(user: UserRequest) {
//
//
// }
export type AdminResponse = {
  status: string;
  message: string;
  httpCode: number;
};

const url = "http://localhost:3050/api/auth/admin/";
export async function adminRegister(user): Promise<AdminResponse> {
  try {
    console.log("📤 Enviando registro de admin al backend:", user);
    const res = await fetch(`${url}register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    console.log("📥 Status de respuesta:", res.status);

    // Intentar leer la respuesta como texto primero
    let data;
    try {
      const text = await res.text();
      console.log("📥 Respuesta raw del backend:", text);

      if (!text || text.trim() === "") {
        console.log("⚠️ Respuesta vacía del backend");
        data = { message: "Respuesta vacía del servidor" };
      } else {
        data = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("❌ Error al parsear JSON:", parseError);
      return {
        status: "error",
        message: "El servidor devolvió una respuesta inválida",
        httpCode: res.status,
      };
    }

    console.log("📥 Datos parseados:", data);

    if (!res.ok) {
      return {
        status: "error",
        message:
          data.message || data.error || `Error ${res.status} en el registro`,
        httpCode: res.status,
      };
    }

    return data;
  } catch (err) {
    console.error("❌ Error en adminRegister:", err);
    return {
      status: "error",
      message:
        err instanceof Error
          ? err.message
          : "Error de conexión con el servidor",
      httpCode: 500,
    };
  }
}
