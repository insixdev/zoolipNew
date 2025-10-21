// app/routes/_layout.tsx o app/root.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { getAuthToken } from "~/server/cookies.js";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getAuthToken(request); // lee cookie del request

  if (!token) return json({ user: null });

  // Pedimos al backend real
  const res = await fetch("http://localhost:3050/api/auth/me", {
    headers: { Cookie: `AUTH_TOKEN=${token}` },
  });

  if (!res.ok) return json({ user: null });

  const user = await res.json();
  return json({ user });
}
