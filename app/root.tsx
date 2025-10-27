import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { AuthProvider } from "./features/auth/authProvider";
import { getAuthToken } from "./server/cookies";
import decodeClaims from "./utils/authUtil";
import type { UserResponse } from "./features/auth/authService";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
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

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getAuthToken(request);
  let user: UserResponse | null = null;

  if (token) {
    const result = decodeClaims(token);
    
    if (result.valid && result.payload.sub) {
      try {
        // In a real app, you would fetch the user from your API here
        // For now, we'll just return the user ID from the token
        user = {
          id_usuario: parseInt(result.payload.sub, 10),
          username: result.payload.username || 'user',
          rol: result.payload.rol || 'user'
        };
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
  }

  return Response.json({ user });
}

export default function App() {
  const { user } = useLoaderData() as { user: UserResponse | null };
  
  return (
    <AuthProvider initialUser={user}>
      <Outlet />
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
