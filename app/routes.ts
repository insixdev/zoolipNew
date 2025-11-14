import type { RouteConfig } from "@react-router/dev/routes";
import { index, route } from "@react-router/dev/routes";

export default [
  // Index route is now community (social feed)
  index("routes/_index.tsx"),

  route("admin-register/invite/:token", "routes/admin/adminRegisterInvite.tsx"),

  route("admin", "routes/admin/_layout.tsx", [
    index("routes/admin/dashboard.tsx"), // /admin - dashboard principal
    route("system", "routes/admin/system/system.tsx"), // /admin/system
    route(
      "system/institutionSolicitudes",
      "routes/admin/system/institutionSolicitudes.tsx"
    ),
    route("system/users", "routes/admin/system/users.tsx"),
    route("system/institutions", "routes/admin/system/institutions.tsx"),
    route(
      "system/institutionSolicitudes/:id",
      "routes/admin/system/institutionSolicitudes.$id.tsx"
    ),
    route("solicitudes", "routes/admin/solicitudes.tsx"), // /admin/solicitudes
    route("donaciones", "routes/admin/donaciones.tsx"), // /admin/donaciones

    route("mascotas", "routes/admin/mascotas.tsx"), // /admin/mascotas
    route("editarMascota/:id", "routes/admin/editarMascota.$id.tsx"), // /admin/editarMascota/:id
    route("api/pets/eliminar/:id", "routes/api/pets/EliminarPet.$id.ts"),

    route("atencion", "routes/admin/atencion.tsx"), // /admin/atencion
    route("registrarAdmin", "routes/admin/registrarAdmin.tsx"), // /admin/registrarAdmin
    route("crearMascota", "routes/admin/crearMascota.tsx"), // /admin/crearMascota
    route("revision-mascota", "routes/admin/revision-mascota.tsx"), // /admin/revision-mascota (solo veterinarias)
    route("reportes", "routes/admin/reportes.tsx"), // /admin/reportes (redirect temporal a dashboard)
  ]),
  // Community nested routes
  route("community", "routes/community/_layout.tsx", [
    index("routes/community/_index.tsx"), // /community
    route("search", "routes/community/search.tsx"), // /community/search
    route("buscar", "routes/community/buscar.tsx"), // /community/buscar
    route("consultas", "routes/community/consultas.tsx"), // /community/consultas
    route("profile", "routes/community/profile.tsx"),
    route("refugios", "routes/community/refugios.tsx"), // /community/refugios
    route("refugio/:id", "routes/community/refugio.$id.tsx"), // /community/refugio/:id
    route("following", "routes/community/following.tsx"), // /community/following
    route("chatCommunity", "routes/community/chatCommunity.tsx"), // /community/chatCommunity
    route("hashtag/:hashtag", "routes/community/communityTrendingView.tsx"), // /community/hashtag/AdopcionResponsable
    route("donaciones", "routes/community/donaciones.tsx"), // /community/donaciones
    route(
      "donacionesInstitucion",
      "routes/community/donacionesInstitucion.tsx"
    ), // /community/donacionesInstitucion
    route("donaciones/checkout", "routes/community/donaciones.checkout.tsx"), // /community/donaciones/checkout
    route(
      "solcitudeInstitutionForm",
      "routes/community/solcitudeInstitutionForm.tsx"
    ), // /community/solcitudeInstitutionForm
    route("profile/:id", "routes/community/profile.$id.tsx"), // /community/profile/:id
  ]),

  // Adopt nested routes
  route("adopt", "routes/adopt/_layout.tsx", [
    index("routes/adopt/_index.tsx"), // /adopt
    route("mis-adopciones", "routes/adopt/mis-adopciones.tsx"), // /adopt/mis-adopciones
    route("chatAdopt", "routes/adopt/chatAdopt.tsx"), // /adopt/chatAdopt
    route("solicitudes", "routes/adopt/solicitudes.tsx"), // /adopt/solicitudes
    //route(":petId", "routes/adopt/[petId].tsx"), // /adopt/max, /adopt/luna, etc.
  ]),
  // Other main routes
  route("landing", "routes/landing.tsx"),
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
  route("api/auth/has-access", "routes/api/auth/has-access.ts"),
  route("api/auth/delete-cookie", "routes/api/auth/delete-cookie.ts"),
  route("api/auth/has-admin-access", "routes/api/auth/has-admin-access.ts"),
  route("api/admin/invitation", "routes/api/admin/invitation.ts"),
  // Post API routes
  route("api/post/crearPost", "routes/api/post/crearPost.ts"),
  route("api/post/actualizar", "routes/api/post/actualizarPost.ts"),
  route("api/post/eliminar", "routes/api/post/eliminarPost.ts"),
  route("api/post/obtenerTodas", "routes/api/post/obtenerTodas.ts"),
  route("api/post/getByPostId", "routes/api/post/getByPostId.ts"),
  route("api/post/updatePost", "routes/api/post/updatePost.ts"),
  route("api/post/comentarios/:id", "routes/api/post/comentarios.$id.ts"),
  route("api/post/like/:id", "routes/api/post/like.$id.ts"),

  // Pets API routes
  route("api/pets/crear", "routes/api/pets/CrearPet.ts"),
  route("api/pets/actualizar", "routes/api/pets/ActualizarPet.ts"),

  // Comments API routes
  route("api/comments/crear", "routes/api/comments/crear.ts"),
  route("api/comments/actualizar", "routes/api/comments/actualizar.ts"),
  route("api/comments/eliminar", "routes/api/comments/eliminar.ts"),

  // User API routes
  route("api/user/profile/:id", "routes/api/user/profile.$id.ts"),

  route(
    "api/comments/obtenerPorPublicacion",
    "routes/api/comments/obtenerPorPublicacion.ts"
  ),

  // Donations API routes
  route("api/donations/crear", "routes/api/donations/crear.ts"),
  route("api/donations/actualizar", "routes/api/donations/actualizar.ts"),
  route("api/donations/eliminar", "routes/api/donations/eliminar.ts"),

  // Adoption API routes
  route("api/adoption/solicitar", "routes/api/adoption/solicitar.ts"),

  // User API routes
  route("api/user/update", "routes/api/user/update.ts"),
] satisfies RouteConfig;
