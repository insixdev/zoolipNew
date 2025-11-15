// para separar funciones en el action de adminRegisterInvite

import { adminRegister } from "../admin/adminService";
import { loginService, registerService } from "../auth/authServiceCurrent";
import { UserAppRegister } from "./User";

export async function registrarAdminProcess(userData) {
  try {
    const res = await adminRegister(userData);

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
    const userRequest = {
      username: userData.username,
      password: userData.password,
    };

    const loginRes = await loginService(userRequest);
    const newCookie = loginRes.headers.get("Set-Cookie");

    if (!newCookie) {
      return {
        error:
          "Registro exitoso pero no se pudo iniciar sesión automáticamente",
        status: 500,
      };
    }

    return newCookie;
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Error inesperado al registrar el administrador",
      status: 500,
    };
  }
}
