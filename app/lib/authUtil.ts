import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constants";

function decodeJwt(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded token:", decoded);
    return decoded;
  } catch (error: any) {
    console.error("Error verifying token:", error.message);
    console.error("Error details:", error);
    throw error;
  }
}

export interface UserTokenPayload {
  id: string;
  username: string;
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
  if (!token || typeof token !== 'string') {
    return { 
      valid: false, 
      error: 'Token is required',
      code: 'INVALID_TOKEN'
    };
  }

  try {
    const payload = decodeJwt(token) as UserTokenPayload;
    
    if (!payload) {
      return {
        valid: false,
        error: 'Invalid token payload',
        code: 'INVALID_TOKEN'
      };
    }

    // Validate required claims
    if (!payload.id || !payload.username) {
      return { 
        valid: false, 
        error: 'Missing required token claims',
        code: 'INVALID_TOKEN_CLAIMS'
      };
    }
    
    return {
      valid: true,
      payload,
    };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return {
        valid: false,
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED',
      };
    }
    
    if (error.name === 'JsonWebTokenError') {
      return {
        valid: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      };
    }
    
    if (error.name === 'NotBeforeError') {
      return {
        valid: false,
        error: 'Token not active yet',
        code: 'TOKEN_NOT_ACTIVE',
      };
    }
    
    console.error('Token validation error:', error);
    return {
      valid: false,
      error: 'Token validation failed',
      code: 'TOKEN_VALIDATION_FAILED',
    };
  }
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
 * Extracts user information from the token payload
 * @param payload The decoded JWT payload
 * @returns An object containing user ID and username or null if required fields are missing
 * 
 * @example
 * ```ts
 * const result = decodeClaims(token);
 * if (result.valid) {
 *   const userInfo = getUserInfoFromToken(result.payload);
 *   if (userInfo) {
 *     console.log(userInfo.id);       // "user-123"
 *     console.log(userInfo.username); // "john_doe"
 *   }
 * }
 * ```
 */
export function getUserInfoFromToken(payload: UserTokenPayload): { id: string; username: string } | null {
  if (!payload?.id || !payload?.username) {
    return null;
  }
  return {
    id: payload.id,
    username: payload.username
  };
}
