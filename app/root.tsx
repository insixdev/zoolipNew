import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  Link,
  useLoaderData,
} from "react-router";
import type {
  LinksFunction,
  LoaderFunction,
  ShouldRevalidateFunction,
} from "react-router";
import { AuthProvider } from "~/features/auth/authProvider";
import { SmartAuthWrapper } from "~/components/auth/SmartAuthWrapper";
import "./app.css";
import { getUserFromRequest } from "./server/me";
import {
  isErrorUser,
  User,
  UserResponseHandler,
} from "./features/entities/User";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
// Función para controlar cuándo revalidar el loader
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  formMethod,
}) => {
  console.log("shouldRevalidate llamado:", {
    currentUrl: currentUrl?.pathname,
    nextUrl: nextUrl?.pathname,
    formMethod,
  });

  // Solo revalidar en navegación inicial (primera carga de la app)
  if (!currentUrl) {
    console.log(
      " Revalidando: Navegación inicial - cargando usuario cargando datos del servidorr principalk"
    );
    return true;
  }

  // revalidar solo en form de autenticación
  if (formMethod && formMethod !== "GET") {
    const isAuthAction =
      nextUrl.pathname.includes("/login") ||
      nextUrl.pathname.includes("/register") ||
      nextUrl.pathname.includes("/profile");
    nextUrl.pathname.includes("/community/crear");
    if (isAuthAction) {
      console.log("Revalidando, mandando request al principal");
      return true;
    }
  }

  //noorevalidar en navegación normal - usar AuthProvider
  // usando lo datos temporales de AuthProvider
  console.log("NO: Usando AuthProvider como fuente, los  datos temporales");
  return false;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  // el root se ejecuta en todo la pagina por el sistema
  // de routes
  console.log(" ROOT LOADER EJECUTADO - URL:", url.pathname);

  // Verificar si el cliente indica que ya tiene datos de usuario
  const skipUserFetch = request.headers.get("X-Skip-User-Fetch");
  if (skipUserFetch === "true") {
    console.log(
      " Cliente indica que ya tiene datos de usuario, saltando fetch"
    );
    return new Response(JSON.stringify({ user: null, authError: null }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Cookie header:", request.headers.get("Cookie"));


  // Estrategia adicional: verificar si es una navegación que realmente necesita datos del usuario
  const publicRoutes = ["/landing", "/info/", "/adopt/_index", "/community/_index" ]; const isPublicRoute = publicRoutes.some((route) => url.pathname.includes(route));

  if (isPublicRoute) {
    console.log(
      "Ruta pública detectada, retornando usuario null sin llamada al servidor"
    );
    return new Response(JSON.stringify({ user: null, authError: null }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await getUserFromRequest(request); // obtiene

  if (user instanceof UserResponseHandler) {
    console.log("enroot: user:", user);
    return new Response(JSON.stringify({ user: user.user, authError: null }), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // No pasar errores de autenticación al contexto
    // Los errores del loader de root no deben mostrarse al usuario
    console.log("Usuario no autenticado en root loader:", user.message);
    return new Response(
      JSON.stringify({
        user: null,
        authError: null, // No pasar el error al contexto
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};

export default function App() {
  const { user: initialUser, authError } = useLoaderData<{
    user: User | null;
    authError: { message: string; status: string } | null;
  }>();
  return (
    <AuthProvider initialUser={initialUser} initialError={authError}>
      <SmartAuthWrapper>
        <Outlet />
      </SmartAuthWrapper>
    </AuthProvider>
  );
}
// error bundary
export function ErrorBoundary() {
  const error = useRouteError();
  console.error("ErrorBoundary:", error);
  return <div>Ha ocurrido un error: {JSON.stringify(error)}</div>;
}
