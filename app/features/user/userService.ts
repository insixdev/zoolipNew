/**
 * Servicio mínimo para obtener usuarios
 * Ajusta las rutas del backend si es necesario (BASE_USER_URL)
 */
const BASE_USER_URL =
  process.env.BASE_USER_URL || "http://localhost:3050/api/usuario/";

export async function getAllUsersService(cookie?: string): Promise<any[]> {
  try {
    const hd = new Headers();
    hd.append("Content-Type", "application/json");
    if (cookie) hd.append("Cookie", cookie);

    const res = await fetch(`${BASE_USER_URL}obtenerTodos`, {
      method: "GET",
      headers: hd,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Error al obtener usuarios");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Get all users error:", err);
    throw err;
  }
}
