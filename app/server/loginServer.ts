import type { Request } from "express";
import { authCookie } from "../cookies";

export async function handleLogin(req: Request) {
  const { username, password } = req.body;

  if (!username || !password) throw new Error("Missing credentials");

  const user = await loginService({ username, password });
  if (!user) throw new Error("Invalid credentials");

  const cookieHeader = await authCookie.serialize(user.token);

  return { user, cookieHeader };
}
