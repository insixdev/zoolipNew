import type { Request } from "express";
import { loginService } from "~/features/auth/authService.js";

export async function handleLogin(req: Request) {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    throw new Error("Missing credentials");
  }

  try {
    const user = await loginService({ username, password });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return { user };
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

