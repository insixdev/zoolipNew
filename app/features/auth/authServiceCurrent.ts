import type {
  User,
  UserAppRegister,
  UserErrorResponse,
  UserRequest,
  UserResponse,
} from "../entities/User";

/** URL base del backend principal */
const BASE_AUTH_URL =
  process.env.BASE_AUTH_URL || "http://localhost:3050/api/auth/";
/** Función para registrarse */
export async function registerService(user): Promise<UserResponse> {
  try {
    console.log("user", user);
    const res = await fetch(`${BASE_AUTH_URL}register`, {
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

/** Función para hacer login */
export async function loginService(user: UserRequest) {
  try {
    const res = await fetch(`${BASE_AUTH_URL}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

/** Fetch del usuario logueado según cookie (me) */
export async function fetchMe(
  cookie: string
): Promise<User | UserErrorResponse> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    hd.append("Cookie", cookie);
    console.log("hdENFETCHME", Object.fromEntries(hd.entries()), hd);

    const res = await fetch(`${BASE_AUTH_URL}me`, {
      method: "GET",
      headers: hd,
    });

    // Verificar si hay contenido antes de parsear
    const text = await res.text();

    console.log("SUCIAS AS", text);

    if (!text || text.trim() === "") {
      console.error("Empty response from /me endpoint");
      return {
        status: "error",
        message: "Empty response from server",
        error: "No content received",
      } as UserErrorResponse;
    }

    const data = JSON.parse(text);

    if (!res.ok) {
      const err = {
        status: data.status,
        message: data.message,
        error: data.error,
      } as UserErrorResponse;

      return err;
    } else {
      return data;
    }
  } catch (err) {
    console.error("Fetch me error:", err);
    return {
      status: "error",
      message: "unespecified srr error",
      error: "Error fetching user",
    };
  }
}

/** Logout */
export async function logoutService(cookie: string): Promise<void> {
  const hd = new Headers();
  hd.append("Content-Type", "application/json");
  hd.append("Cookie", cookie);

  try {
    await fetch(`${BASE_AUTH_URL}logout`, {
      method: "POST",
      headers: hd,
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
}
