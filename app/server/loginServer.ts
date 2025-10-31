import { loginService } from "~/features/auth/authService.js";
import {  type UserServerRequest, type UserServerResponse } from "~/features/user/User";

/*validaaciones server ssr para el login */
export async function handleLogin(req: UserServerRequest) {
  const { username, password } = req;


  if (!username || !password) {
    throw new Response("Missing credentials", { status: 400 });
  }
  try {
    const user = await loginService({ username, password });

    if (!user) {
      throw new Response("Invalid credentials", { status: 401 });
    }else if (user.message == "error"){
      throw new Response("credentials", { status: 401 });
    }
    return user
  } catch (err) {
    console.error("Login error:", err);
    throw new Response("Server error", { status: 500 });
  }
}

