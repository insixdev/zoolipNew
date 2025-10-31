import { decodeClaims } from "~/lib/authUtil";
import type { LoaderFunctionArgs } from "react-router";

const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:3050/api/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const token = cookieHeader?.split('; ').find(row => row.startsWith('AUTH_TOKEN='))?.split('=')[1];

  if (!token) {
    return Response.json(
      { message: "Not authenticated, no token", status: "error" },
      { status: 401 }
    );
  }

  try {
    const jwtPayload = decodeClaims(token);
    const response = await fetch(`${SPRING_API_URL}/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `AUTH_TOKEN=${token}`
      },
      body: JSON.stringify(jwtPayload.id_usuario)
    });

    if (!response.ok) {
      return Response.json(
      { message: "Invalid token", status: "error" },
      { status: response.status }
    );
    }

    const user = await response.json();
    return Response.json(user, { status: 200 });
  } catch (err) {
    console.error("Error in /me endpoint:", err);
    return Response.json(
      { message: "Internal server error", status: "error" },
      { status: 500 }
    );
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  // Manejar solicitudes POST si es necesario
  return Response.json({ message: "Method not allowed" }, { status: 405 });
}
