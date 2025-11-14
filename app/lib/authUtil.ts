import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./server-constants";
import { getTokenFromCookie } from "~/server/cookies";
/**
 * Funcion para verificar el token y que no haya caducado
 * con la secret key del servidor principal
 */
export function verifyToken(token: string): boolean {
  console.log("JWT SECRET : " + JWT_SECRET);
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error: any) {
    console.error("Error verifying token:", error.message);
    return false;
  }
}

/**
 * Función interna para decodificar y verificar el JWT
 */
function decodeJwt(token: string): UserTokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      throw new Error("Token invalid");
    }

    // Parsear el role para limpiar duplicados (ROLE_ROLE_USER -> ROLE_USER)
    if (decoded.role && typeof decoded.role === "string") {
      // Si el role empieza con "ROLE_ROLE_", quitamos el primer "ROLE_"
      if (decoded.role.startsWith("ROLE_ROLE_")) {
        decoded.role = decoded.role.replace("ROLE_ROLE_", "ROLE_");
        console.log(`[JWT] Role corregido: ${decoded.role}`);
      }
    }

    return decoded as UserTokenPayload;
  } catch (error: any) {
    console.error("Error verifying token:", error.message);
    throw error;
  }
}

export interface UserTokenPayload {
  id_usuario: number;
  sub: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export type TokenValidationResult =
  | { valid: true; payload: UserTokenPayload }
  | { valid: false; error: string; code: string };

/**
 * Decodes and verifies a JWT token
 * Uses jsonwebtoken to verify the signature and validate the token
 *
 * @param token - JWT token string (from cookie, header, etc.)
 * @returns TokenValidationResult object with valid flag and payload or error
 *
 * @example
 * ```ts
 * // Get token from cookie or header
 * const token = request.cookies.get('auth_token');
 *
 * // Decode and verify the token
 * const result = decodeClaims(token);
 *
 * if (result.valid) {
 *   // Access the claims
 *   console.log(result.payload.id);        // User ID
 *   console.log(result.payload.username);  // Username
 *   console.log(result.payload.exp);       // Expiration time
 *   console.log(result.payload.iat);       // Issued at
 * } else {
 *   // Handle error
 *   console.error(result.error);  // Error message
 *   console.error(result.code);   // Error code (TOKEN_EXPIRED, INVALID_TOKEN, etc.)
 * }
 * ```
 */
export function decodeClaims(token: string): TokenValidationResult {
  if (!token || typeof token !== "string") {
    return {
      valid: false,
      error: "Token is required",
      code: "INVALID_TOKEN",
    };
  }

  try {
    const payload = decodeJwt(token);
    console.log("[JWT] Token decodificado:", {
      id_usuario: payload.id_usuario,
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });

    if (!payload) {
      return {
        valid: false,
        error: "Invalid token payload",
        code: "INVALID_TOKEN",
      };
    }

    // Validate required claims
    if (
      !payload.id_usuario ||
      !payload.sub ||
      !payload.email ||
      !payload.role
    ) {
      return {
        valid: false,
        error: "Missing required token claims (id, username, email, role)",
        code: "INVALID_TOKEN_CLAIMS",
      };
    }

    return {
      valid: true,
      payload,
    };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return {
        valid: false,
        error: "Token has expired",
        code: "TOKEN_EXPIRED",
      };
    }

    if (error.name === "JsonWebTokenError") {
      return {
        valid: false,
        error: "Invalid token",
        code: "INVALID_TOKEN",
      };
    }

    if (error.name === "NotBeforeError") {
      return {
        valid: false,
        error: "Token not active yet",
        code: "TOKEN_NOT_ACTIVE",
      };
    }

    console.error("Token validation error:", error);
    return {
      valid: false,
      error: "Token validation failed",
      code: "TOKEN_VALIDATION_FAILED",
    };
  }
}
export enum field {
  id = "id_usuario", // El JWT usa id_usuario, no id
  username = "sub", // El JWT usa sub para username
  email = "email",
  role = "role",
}

// mediante el cookie extraemos el token
// y lo decodificamos
// y obtenemos el payload
// y obtenemos el campo que queremos
export function getUserFieldFromCookie(cookie: string, fieldName: string) {
  if (cookie) {
    const token = getTokenFromCookie(cookie);
    if (token) {
      const result = decodeClaims(token);
      if (result.valid) {
        const value = result.payload[fieldName];
        console.log(`[getUserFieldFromCookie] Field '${fieldName}':`, value);
        return value;
      } else {
        console.log("[getUserFieldFromCookie] Token invalid");
        return null;
      }
    } else {
      console.log("[getUserFieldFromCookie] No token found");
      return null;
    }
  }
  console.log("[getUserFieldFromCookie] No cookie");
  return null;
}

/**
 * Extracts user ID from the token payload
 * @param payload The decoded JWT payload
 * @returns The user ID or null if not found
 *
 * @example
 * ```ts
 * const result = decodeClaims(token);
 * if (result.valid) {
 *   const userId = getUserIdFromToken(result.payload);
 *   console.log(userId); // "user-123"
 * }
 * ```
 */
export function getUserIdFromToken(payload: UserTokenPayload): string | null {
  return payload?.id || null;
}

/**
 * Extracts username from the token payload
 * @param payload The decoded JWT payload
 * @returns The username or null if not found
 *
 * @example
 * ```ts
 * const result = decodeClaims(token);
 * if (result.valid) {
 *   const username = getUsernameFromToken(result.payload);
 *   console.log(username); // "john_doe"
 * }
 * ```
 */
export function getUsernameFromToken(payload: UserTokenPayload): string | null {
  return payload?.username || null;
}

/**
 * Extracts email from the token payload
 * @param payload The decoded JWT payload
 * @returns The email or null if not found
 *
 * @example
 * ```ts
 * const result = decodeClaims(token);
 * if (result.valid) {
 *   const email = getEmailFromToken(result.payload);
 *   console.log(email); // "user@example.com"
 * }
 * ```
 */
export function getEmailFromToken(payload: UserTokenPayload): string | null {
  return payload?.email || null;
}

/**
 * Extracts role from the token payload
 * @param payload The decoded JWT payload
 * @returns The role or null if not found
 *
 * @example
 * ```ts
 * const result = decodeClaims(token);
 * if (result.valid) {
 *   const role = getRoleFromToken(result.payload);
 *   console.log(role); // "user" or "admin"
 * }
 * ```
 */
export function getRoleFromToken(payload: UserTokenPayload): string | null {
  return payload?.role || null;
}

/**
 * Extracts user information from the token payload
 * @param payload The decoded JWT payload
 * @returns An object containing user information or null if required fields are missing
 *
 * @example
 * ```ts
 * const result = decodeClaims(token);
 * if (result.valid) {
 *   const userInfo = getUserInfoFromToken(result.payload);
 *   if (userInfo) {
 *     console.log(userInfo.id);       // "user-123"
 *     console.log(userInfo.username); // "john_doe"
 *     console.log(userInfo.email);    // "user@example.com"
 *     console.log(userInfo.role);     // "user"
 *   }
 * }
 * ```
 */
export function getUserInfoFromToken(
  payload: UserTokenPayload
): { id: string; username: string; email: string; role: string } | null {
  if (
    !payload?.id_usuario ||
    !payload?.sub ||
    !payload?.email ||
    !payload?.role
  ) {
    return null;
  }
  return {
    id: payload.id_usuario.toString(),
    username: payload.sub, // 'sub' es el username en JWT
    email: payload.email,
    role: payload.role,
  };
}
