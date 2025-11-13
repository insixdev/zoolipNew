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
  redirect,
} from "react-router";
import type {
  LinksFunction,
  LoaderFunction,
  ShouldRevalidateFunction,
} from "react-router";
import { AuthProvider } from "~/features/auth/authProvider";
import { SmartAuthWrapper } from "~/components/auth/SmartAuthWrapper";
import { InstitutionRequestProvider } from "~/context/InstitutionRequestContext";
import CookieBanner from "~/components/ui/CookieBanner";
import "./app.css";
import { getUserFromRequest } from "./server/me";
import {
  isErrorUser,
  User,
  UserResponseHandler,
} from "./features/entities/User";
import Landing from "./routes/landing";
import { authCookie } from "./routes/api/auth/delete-cookie";
import { useEffect } from "react";

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

  // Revalidar después de acciones de autenticación
  if (formMethod && formMethod !== "GET") {
    const isAuthAction =
      nextUrl.pathname.includes("/login") ||
      nextUrl.pathname.includes("/register") ||
      nextUrl.pathname.includes("/logout");
    if (isAuthAction) {
      console.log("✅ Revalidando después de acción de autenticación");
      return true;
    }
  }

  // Revalidar cuando cambia la URL después del login
  // Esto captura la navegación después de un login exitoso
  if (
    currentUrl.pathname.includes("/login") &&
    !nextUrl.pathname.includes("/login")
  ) {
    console.log("✅ Revalidando: navegación desde login a otra ruta");
    return true;
  }

  // No revalidar en navegación normal - usar AuthProvider
  console.log("❌ NO revalidando: Usando datos de AuthProvider en memoria");
  return false;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  // el root se ejecuta en todo la pagina por el sistema
  // de routes
  console.log(" ROOT LOADER EJECUTADO - URL:", url.pathname);

  // Estrategia adicional: verificar si es una navegación que realmente necesita datos del usuario
  const publicRoutes = ["/landing", "/info/", "/community"];

  const isPublicRoute = publicRoutes.some((route) =>
    url.pathname.includes(route)
  );

  // Para rutas públicas, intentar cargar usuario si hay cookie, sino retornar null
  if (isPublicRoute) {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) {
      console.log("🌍 Ruta pública sin autenticación, retornando usuario null");
      return new Response(JSON.stringify({ user: null, authError: null }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    // Si hay cookie, continuar para cargar el usuario
    console.log("🌍 Ruta pública con cookie, cargando usuario");
  }

  console.log("Cookie header:", request.headers.get("Cookie"));

  const userResponse = await getUserFromRequest(request); // obtiene

  if (!isErrorUser(userResponse)) {
    console.log("✅ Usuario autenticado:", userResponse.user?.username);
    // Retornar solo el objeto User, no todo el UserResponseHandler
    return Response.json({
      user: userResponse.user,
      authError: null,
    });
  } else {
    if (
      !userResponse ||
      userResponse.status === "error" ||
      userResponse.message === "Invalid token"
    ) {
      console.log("❌ Token inválido, eliminando cookie");
      console.log("Error:", userResponse?.message);

      return Response.json(
        { authError: "Invalid token", user: null },
        {
          headers: {
            "Set-Cookie": await authCookie.serialize("", {
              maxAge: 0,
              path: "/",
              expires: new Date(0),
            }), // 🔥 elimina la cookie
          },
        }
      );
    }

    // Otro tipo de error (no token inválido)
    console.log("⚠️ Error al obtener usuario:", userResponse?.message);

    return Response.json({
      user: null,
      authError: null, // No pasar el error al contexto para no mostrar mensajes confusos
    });
  }
};

export default function App() {
  // para mejor optimizacion hacemos un chekeo rapido en el frontend acerca de si tiene cookie
  //
  const { user: initialUser, authError } = useLoaderData<{
    user: User | null;
    authError: { message: string; status: string } | null;
  }>();
  console.log("initialUser: ", initialUser);
  console.log("ERROR", authError);

  useEffect(() => {
    if (initialUser) {
      console.log("initialUser: ", initialUser);
    }
  }, []);

  return (
    <AuthProvider initialUser={initialUser}>
      <SmartAuthWrapper>
        <InstitutionRequestProvider>
          <Outlet />
          <CookieBanner />
        </InstitutionRequestProvider>
      </SmartAuthWrapper>
    </AuthProvider>
  );
}
// error bundary

export function ErrorBoundary() {
  const error = useRouteError();
  console.error("Error capturó:", error);

  // Caso 1: error lanzado como `throw new Response(...)`
  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-red-600">
          {error.status} {error.statusText}
        </h1>
        <p className="text-gray-600 mb-6">
          {error.data || "Ocurrió un error mientras se cargaban los datos."}
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Volver al inicio
        </a>
      </div>
    );
  }

  // Caso 2: error normal (excepción JS)
  if (error instanceof Error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-red-600">
          Error inesperado
        </h1>
        <p className="text-gray-700 mb-2">{error.message}</p>

        <details className="bg-gray-100 text-left p-4 rounded mt-4 w-full max-w-lg">
          <summary className="cursor-pointer font-semibold">
            Detalles técnicos
          </summary>
          <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
            {error.stack}
          </pre>
        </details>

        <a
          href="/"
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Volver al inicio
        </a>
      </div>
    );
  }

  // Caso 3: fallback final (por si el error no tiene forma conocida)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-red-600">
        Error desconocido
      </h1>
      <pre className="text-gray-700">{JSON.stringify(error, null, 2)}</pre>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Volver al inicio
      </a>
    </div>
  );
}
