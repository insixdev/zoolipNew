import type { RegisterUserResponse, UserAppRegister, UserRequest, UserResponse } from "../user/User";

/** URL base del backend principal */
const BASE_AUTH_URL = "http://localhost:3050/api/auth/";


/** Función para registrarse */
export async function registerService(user: UserAppRegister): Promise<RegisterUserResponse> {
  try {
    const res = await fetch(`${BASE_AUTH_URL}register`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // para que las cookies se envíen automáticamente
      body: JSON.stringify(user)
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

/** Función para hacer login */
export async function loginService(user: UserRequest): Promise<UserResponse> {
  try {
    const res = await fetch(`${BASE_AUTH_URL}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // cookies se envían automáticamente
      body: JSON.stringify(user)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

/** Fetch del usuario logueado según cookie (me) */
export async function fetchMe(): Promise<UserResponse | null> {
  try {
    const res = await fetch(`${BASE_AUTH_URL}me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user;
  } catch (err) {
    console.error("Fetch me error:", err);
    return null;
  }
}

/** Logout */
export async function logoutService(): Promise<void> {
  try {
    await fetch(`${BASE_AUTH_URL}logout`, {
      method: "POST",
      credentials: "include"
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
}
