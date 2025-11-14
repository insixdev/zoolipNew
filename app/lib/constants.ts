// Roles de usuario - Con prefijo ROLE_
//
// Los roles específicos de institución se asignan en el SSR (me.ts)
// cuando un ROLE_ADMINISTRADOR tiene una institución asociada:
// - ROLE_VETERINARIA (para instituciones tipo VETERINARIA)
// - ROLE_REFUGIO (para instituciones tipo REFUGIO)

export const ADMIN_ROLES = {
  VETERINARIO: "ROLE_VETERINARIA",
  REFUGIO: "ROLE_REFUGIO",
  ADMINISTRADOR: "ROLE_ADMINISTRADOR",
  SYSTEM: "ROLE_SYSTEM",
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export const USER_ROLES = {
  USER: "ROLE_USER",
  ADOPTANTE: "ROLE_ADOPTANTE",
  ADMIN: "ROLE_ADMINISTRADOR",
  VETERINARIA: "ROLE_VETERINARIA",
  REFUGIO: "ROLE_REFUGIO",
  SYSTEM: "ROLE_SYSTEM",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const APP_NAME = "Zoolip";
export const COOKIE_NAME = "zoolip-auth";
