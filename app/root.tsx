
// app/root.tsx
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import stylesUrl from "./app.css";

// Cargar CSS
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Metadata
export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { title: "Mi App" },
];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="pt-16 p-4 container mx-auto">
          <Outlet /> {/* Aquí se renderizan las rutas hijas */}
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload /> {/* Solo en dev */}
      </body>
    </html>
  );
}

// ErrorBoundary específico de Remix
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <html>
      <head>
        <title>¡Error!</title>
      </head>
      <body>
        <main className="pt-16 p-4 container mx-auto">
          <h1>Oops!</h1>
          <p>{error.message}</p>
          <pre>{error.stack}</pre>
        </main>
        <Scripts />
      </body>
    </html>
  );
}

