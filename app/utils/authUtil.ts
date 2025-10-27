
import {  verify, JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken"
export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
  // Add other custom claims your backend might include
  [key: string]: any;
}

export type TokenValidationResult = 
  | { valid: true; payload: UserTokenPayload }
  | { valid: false; error: string; code: string };

/**
 * Decodes and verifies a JWT token using the server secret.
 * @param token The JWT token to decode.
 * @returns The decoded payload or an error object.
 */
export default function decodeClaims(token: string): TokenValidationResult {
  if (!token || typeof token !== 'string') {
    return { 
      valid: false, 
      error: 'Token is required',
      code: 'INVALID_TOKEN'
    };
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables');
    return { 
      valid: false, 
      error: 'Server configuration error',
      code: 'SERVER_ERROR'
    };
  }

  try {
    const payload = verify(token, secret) as UserTokenPayload;
    
    // Validate required claims
    if (!payload.id || !payload.username) {
      return { 
        valid: false, 
        error: 'Missing required token claims',
        code: 'INVALID_TOKEN_CLAIMS'
      };
    }
    
    return { valid: true, payload };
    
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return { 
        valid: false, 
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      };
    }
    // error: Invalid token
    if (error instanceof JsonWebTokenError) {
      return { 
        valid: false, 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      };
    }
    // error: Token not active
    if (error instanceof NotBeforeError) {
      return { 
        valid: false, 
        error: 'Token not active',
        code: 'TOKEN_NOT_ACTIVE'
      };
    }
    
    console.error('Unexpected error verifying token:', error);
    return { 
      valid: false, 
      error: 'Error verifying token',
      code: 'VERIFICATION_ERROR'
    };
  }
}

/**
 * Extracts user ID from the token payload
 * @param payload The decoded JWT payload
 * @returns The user ID or null if not found
 */
export function getUserIdFromToken(payload: UserTokenPayload): string | null {
  return payload?.id || null;
}

/**
 * Extracts username from the token payload
 * @param payload The decoded JWT payload
 * @returns The username or null if not found
 */
export function getUsernameFromToken(payload: UserTokenPayload): string | null {
  return payload?.username || null;
}

/**
 * Extracts user information from the token payload
 * @param payload The decoded JWT payload
 * @returns An object containing user ID and username or null if required fields are missing
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

