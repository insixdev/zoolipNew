import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("community", "routes/community.tsx"),
  route("adopt", "routes/adopt.tsx"),
  
  // Auth routes
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  
  // Info routes
  route("info/about", "routes/info/about.tsx"),
  route("info/adopt", "routes/info/adopt.tsx"),
  route("info/cookies", "routes/info/cookies.tsx"),
  route("info/privacidad", "routes/info/privacidad.tsx"),
  route("info/proceso-adopcion", "routes/info/proceso-adopcion.tsx"),
  route("info/terminos", "routes/info/terminos.tsx"),
  
  // API routes
  route("api/auth/login", "routes/api/auth/login.ts"),
  route("api/auth/me", "routes/api/auth/me.ts"),
  route("api/auth/register", "routes/api/auth/register.ts"),
] satisfies RouteConfig;