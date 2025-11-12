// para separar funciones en el action de adminRegisterInvite

import { adminRegister } from "../admin/adminService";
import { loginService, registerService } from "../auth/authServiceCurrent";
import { UserAppRegister } from "./User";

export async function registrarAdminProcess(userData: UserAppRegister){
// primero lo registramos como usuario admiin
    try {
    console.log("ADMIN REGISTER DATA:", userData);

    const res = await adminRegister(userData);
    console.log("ADMIN REGISTER Response:", res);
    if (!res) {
    return { 
      error: "Error al registrar el administrador" ,
      status: 400
    };
    }
    if (res.status === "error") {
      return { error: res.message,  status: 400 }
    }

    const userRequest = {
      username: userData.username,
      password: userData.password
    };

    // logeamos para la cookie
    const loginRes = await loginService(userRequest);

    const cookie = loginRes.headers.get("Set-Cookie");

    if (!cookie) {
      return { error: "Error al registrar el administrador intentalo de nuevo", status: 400 }
    }

    return cookie;

  }catch (error) {
    console.error("Error registering admin:", error);
    return { error: "Error al registrar el administrador" ,  status: 400 }
  }
}
