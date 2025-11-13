// para separar funciones en el action de adminRegisterInvite

import { adminRegister } from "../admin/adminService";
import { loginService, registerService } from "../auth/authServiceCurrent";
import { UserAppRegister } from "./User";

export async function registrarAdminProcess(userData ) {
  // Primero lo registramos como usuario admin
  try {
    console.log(
      " Iniciando proceso de registro de admin:",
      userData.username
    );

    const res = await adminRegister(userData);
    console.log(" Respuesta de adminRegister:", res);

    if (!res) {
      return {
        error: "No se recibió respuesta del servidor",
        status: 500,
      };
    }
    if (res.status === "error") {
      return {
        error: res.message || "Error al registrar el administrador",
        status: res.httpCode || 400,
      };
    }

    // Si el registro fue exitoso, hacer login para obtener la cookie
    console.log(" Registro exitoso, iniciando sesión...");

    const userRequest = {
      username: userData.username,
      password: userData.password,
    };

    const loginRes = await loginService(userRequest);
    const cookie = loginRes.headers.get("Set-Cookie");

    if (!cookie) {
      return {
        error:
          "Registro exitoso pero no se pudo iniciar sesión automáticamente",
        status: 500,
      };
    }

    console.log("✅ Login exitoso, cookie obtenida");
    return cookie;
  } catch (error) {
    console.error("❌ Error en registrarAdminProcess:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Error inesperado al registrar el administrador",
      status: 500,
    };
  }
}
