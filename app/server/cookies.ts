
// app/server/cookies.ts
import { parse } from "cookie";

export function getAuthToken(request: Request): string | null  {

  const cookieHeader = request.headers.get("Cookie");
  console.log("cookieHeader: "+ cookieHeader )

  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);

  return cookies["AUTH_TOKEN"] || null;
}
