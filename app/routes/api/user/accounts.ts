import { type LoaderFunctionArgs } from "react-router";
import { requireAuth } from "~/lib/authGuard";

const BASE_URL =
  process.env.BASE_USER_URL || "http://localhost:3050/api/usuarios";

export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar autenticación
  await requireAuth(request);

  const cookie = request.headers.get("Cookie") || "";
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return Response.json({ error: "Email es requerido" }, { status: 400 });
  }

  try {
    console.log("[USER ACCOUNTS] Obteniendo cuentas para email:", email);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Cookie", cookie);

    const response = await fetch(
      `${BASE_URL}/obtenerPorEmail?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers,
      }
    );

    console.log("[USER ACCOUNTS] Status de respuesta:", response.status);

    if (response.status === 204) {
      console.log("[USER ACCOUNTS] No se encontraron cuentas");
      return Response.json({ accounts: [] });
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const accounts = await response.json();
    console.log("[USER ACCOUNTS] Cuentas obtenidas:", accounts.length);

    return Response.json({ accounts });
  } catch (error) {
    console.error("[USER ACCOUNTS] Error:", error);
    return Response.json(
      { error: "Error al obtener cuentas", accounts: [] },
      { status: 500 }
    );
  }
}
