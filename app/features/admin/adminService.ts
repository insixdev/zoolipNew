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
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    const res = await fetch(`${url}register`, {
      method: "POST",
      headers: hd,
      body: JSON.stringify(user),
    });

    // Leer la respuesta como texto primero
    const text = await res.text();

    // Si la respuesta está vacía
    if (!text || text.trim() === "") {
      // Si el status es 200/201, considerar éxito aunque no haya body
      if (res.ok) {
        return {
          status: "success",
          message: "Administrador registrado exitosamente",
          httpCode: res.status,
        };
      }

      // Si no es ok y está vacío, es un error
      return {
        status: "error",
        message: `Error ${res.status}: El servidor no devolvió información`,
        httpCode: res.status,
      };
    }

    // Intentar parsear el JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      return {
        status: "error",
        message:
          "El servidor devolvió una respuesta inválida: " +
          text.substring(0, 100),
        httpCode: res.status,
      };
    }

    // Si no es ok, devolver error
    if (!res.ok) {
      return {
        status: "error",
        message:
          data.message || data.error || `Error ${res.status} en el registro`,
        httpCode: res.status,
      };
    }

    // Si es ok, devolver los datos o un éxito genérico
    return {
      status: "success",
      message: data.message || "Administrador registrado exitosamente",
      httpCode: res.status,
    };
  } catch (err) {
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
