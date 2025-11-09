// Roles de usuario - NUNCA cambiar estos valores
//
//fallback

export const USER_ROLES = {
  USER: "ROLE_USER",
  ADOPTANTE: "ROLE_ADOPTANTE",
  ADMIN: "ROLE_ADMINISTRADOR",
}
//
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const APP_NAME = "Zoolip";
export const COOKIE_NAME = "zoolip-auth";
