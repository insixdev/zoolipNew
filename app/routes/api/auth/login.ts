
// app/routes/api/auth/login.ts

import { error } from "console";
import { loginService, type UserRequest } from "~/features/auth/authService.js";
import type { UserServerRequest } from "~/features/user/User";
import { getAuthToken } from "~/server/cookies.js";

import { handleLogin } from "~/server/loginServer.js";

// 
export async function loginAction( { request  }: { request: Request})  {
  const userBody: UserServerRequest =  await request.json();
  try {
    // se ejecuta la logica del server
    const user = await handleLogin(userBody); 
    // retornamos al cliente
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch(err:any){
    // aca catcheamos los errores que mismo mandamos en el ssr
    console.error("login error: ", err)
    return new Response(JSON.stringify(
      {
        error: err.message,
        message: `error from ssr: ${err.message}`, 
        puta: "hehe"
      }
    ),
      {
        status: 401,
        headers: {"Content-Type": "application/json" },
      } 
    )
  }
};
