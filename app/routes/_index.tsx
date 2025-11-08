import { redirect, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { optionalAuth } from "~/lib/authGuard";
import { UserResponseHandler } from "~/features/entities/User";
import { getDashboardRouteByRole } from "~/lib/routeUtils";

// Loader que redirige automáticamente según el rol del usuario
export async function loader({ request }: LoaderFunctionArgs) {
  const userResult = await optionalAuth(request);

  // Si el usuario está autenticado, redirigir a su dashboard correspondiente
  if (userResult && !("succes" in userResult)) {
    const user = userResult as UserResponseHandler;
    const dashboardRoute = getDashboardRouteByRole(user.user.role);
    throw redirect(dashboardRoute);
  }

  // Si no está autenticado, redirigir a landing
  throw redirect("/landing");
}

export default function Index() {
  // Esta página nunca se renderiza porque siempre redirige
  return null;
}
