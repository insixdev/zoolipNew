// Server-side constants - ONLY import this in server code (loaders, actions, etc.)
// DO NOT import in client components or routes

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
