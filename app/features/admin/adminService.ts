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
export type  AdminResponse ={
  status: string,
  message: string,
  httpCode: number
}

const url = "http://localhost:3050/api/auth/admin/"
export async function adminRegister(user): Promise<AdminResponse> {
  try {
    console.log("userADMIN", user);
    const res = await fetch(`${url}register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error en el registro");
    }
    return data;
  } catch (err) {
    console.error("Register error:", err);
    throw err;
  }

}