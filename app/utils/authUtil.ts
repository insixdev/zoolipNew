
import type { JwtPayload } from "jsonwebtoken";
import type { verify, JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";

export type TokenValidationResult = 
  | { valid: true; payload: JwtPayload }
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
    const payload = verify(token, secret) as JwtPayload;
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

