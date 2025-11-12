// Roles de usuario - NUNCA cambiar estos valores
//
//fallback
//"tipo": "REFUGIO|VETERINARIA|PROTECTORA",

export const ADMIN_ROLES = {
  VETERINARIO: "VETERINARIA",
  PROTECTORA: "PROTECTORA",
  REFUGIO: "REFUGIO",
  ADMINISTRADOR: "ROLE_ADMINISTRADOR",
  SYSTEM: "ROLE_SYSTEM",
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export const USER_ROLES = {
  USER: "ROLE_ROLE_USER",
  ADOPTANTE: "ROLE_ADOPTANTE",
  ADMIN: "ROLE_ADMINISTRADOR",
  SYSTEM: "ROLE_SYSTEM",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const APP_NAME = "Zoolip";
export const COOKIE_NAME = "zoolip-auth";
