// Server-side JWT secret
// In production, this MUST be set via environment variables
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  (() => {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "JWT_SECRET environment variable is required in production"
      );
    }
    // Solo para desarrollo - generar una clave temporal
    console.warn(
      " Using default JWT_SECRET for development. Set JWT_SECRET environment variable for production."
    );
      
    return "dev-jwt-secret-zoolip-2024-change-in-production";
  })();

// Otras constantes de la aplicación
export const APP_NAME = "Zoolip";
export const COOKIE_NAME = "zoolip-auth";
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 días en segundos
