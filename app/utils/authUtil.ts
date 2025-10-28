// Simple JWT decode function
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// User token payload interface
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
 * Decodes a JWT token without verification
 * Note: This only decodes the token, it doesn't verify the signature
 * The actual authentication is handled by the server via cookies
 */
export async function decodeClaims(token: string): Promise<TokenValidationResult> {
  if (!token || typeof token !== 'string') {
    return { 
      valid: false, 
      error: 'Token is required',
      code: 'INVALID_TOKEN'
    };
  }

  try {
    // Only decode the token, don't verify it
    // The actual verification happens on the server via cookies
    const payload = decodeJwt(token) as UserTokenPayload;

    // Check if token is expired (jose already verifies this, but we'll check anyway)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return {
        valid: false,
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED',
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
    if (error.code === 'ERR_JWT_EXPIRED') {
      return {
        valid: false,
        error: 'Token has expired',
        code: 'TOKEN_EXPIRED',
      };
    }
    
    if (error.code === 'ERR_JWS_INVALID') {
      return {
        valid: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      };
    }
    
    if (error.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
      return {
        valid: false,
        error: 'Token validation failed',
        code: 'TOKEN_VALIDATION_FAILED',
      };
    }
    
    // For any other errors
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

