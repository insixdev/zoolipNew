import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  Link,
} from "react-router";
import type { LinksFunction } from "react-router";
import { AuthProvider } from "~/features/auth/authProvider";

import "./app.css";

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

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

// Error boundary component for handling route errors
export function ErrorBoundary() {
  const error = useRouteError();
  console.error("ErrorBoundary caught an error:", error);

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-orange-200">
          <div className="mb-6">
            <div className="text-6xl mb-4">🐾</div>
            <h1 className="text-4xl font-bold text-orange-600 mb-2">
              {error.status}
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {error.statusText}
            </h2>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            {error.data?.message ||
              "Parece que esta página no existe o hubo un problema al cargarla."}
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-orange-300/50"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Handle other types of errors
  const errorMessage =
    error instanceof Error ? error.message : "Ocurrió un error inesperado";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-4">
      <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-orange-200 max-w-md">
        <div className="mb-6">
          <div className="text-6xl mb-4">😿</div>
          <h1 className="text-4xl font-bold text-orange-600 mb-4">
            ¡Ups! Algo salió mal
          </h1>
        </div>
        <p className="text-lg text-gray-600 mb-6">{errorMessage}</p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-orange-300/50"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
