
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Decodes and verifies a JWT token using the server secret.
 * @param token The JWT token to decode.
 * @returns The decoded payload, or an error message string.
 */
export function decodeClaims(token: string): JwtPayload | string {
  if (!token) return "token is null";

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables");
    return "server misconfigured";
  }

  try {
    const claims = jwt.verify(token, secret) as JwtPayload;
    console.log("Token claims:", claims);
    return claims;
  } catch (err: any) {
    console.error("Error verifying token:", err);

    if (err.name === "TokenExpiredError") {
      return "token expired";
    }
    return "invalid token";
  }
}

