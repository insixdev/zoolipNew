import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
  // Index route is now community (social feed)
  index("routes/_index.tsx"),

  // Community nested routes
  route("community", "routes/community/_layout.tsx", [
    index("routes/community/_index.tsx"), // /community
    route("search", "routes/community/search.tsx"), // /community/search
    route("buscar", "routes/community/buscar.tsx"), // /community/buscar
    route("consultas", "routes/community/consultas.tsx"), // /community/consultas
    route("crear", "routes/community/crear.tsx"), // /community/crear
    route("refugios", "routes/community/refugios.tsx"), // /community/refugios
    route("following", "routes/community/following.tsx"), // /community/following
    route("chatCommunity", "routes/community/chatCommunity.tsx"), // /community/chatCommunity
    route("hashtag/:hashtag", "routes/community/communityTrendingView.tsx"), // /community/hashtag/AdopcionResponsable
  ]),

  // Adopt nested routes
  route("adopt", "routes/adopt/_layout.tsx", [
    index("routes/adopt/_index.tsx"), // /adopt
    route("mis-adopciones", "routes/adopt/mis-adopciones.tsx"), // /adopt/mis-adopciones
    route("chatAdopt", "routes/adopt/chatAdopt.tsx"), // /adopt/chatAdopt
    route("favoritos", "routes/adopt/favoritos.tsx"), // /adopt/favoritos
    route("solicitudes", "routes/adopt/solicitudes.tsx"), // /adopt/solicitudes
    //route(":petId", "routes/adopt/[petId].tsx"), // /adopt/max, /adopt/luna, etc.
  ]),

  // Other main routes
  route("landing", "routes/landing.tsx"),
  route("profile", "routes/profile.tsx"),
  route("settings", "routes/settings.tsx"),

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
  route("api/auth/register", "routes/api/auth/register.ts"),
  route("api/auth/logout", "routes/api/auth/logout.ts"),
] satisfies RouteConfig;
