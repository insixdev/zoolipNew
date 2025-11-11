import { decodeClaims, TokenValidationResult } from "~/lib/authUtil";
import {
  getTokenFromCookie,
  getHeaderCookie,
  verifyTokenFromCookie,
} from "~/server/cookies";
import { fetchMe } from "~/features/auth/authServiceCurrent";
import {
  UserErrorHandler,
  UserResponseHandler,
  User,
} from "~/features/entities/User";
import { w } from "public/build/_shared/chunk-O7IRWV66";

// Cache simple en memoria para evitar múltiples llamadas
const userCache = new Map<
  string,
  {
    data: UserResponseHandler | UserErrorHandler;
    timestamp: number;
  }
>();

// Cache para evitar llamadas duplicadas muy rápidas
const recentCalls = new Map<string, number>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos - más agresivo
const DUPLICATE_CALL_THRESHOLD = 1000; // 1 segundo

// Función para limpiar el caché (útil para logout)
export function clearUserCache() {
  userCache.clear();
  recentCalls.clear();
  console.log("CACHE LIMPIADO");
}

// Limpiar llamadas recientes antiguas periódicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of recentCalls.entries()) {
    if (now - timestamp > DUPLICATE_CALL_THRESHOLD * 2) {
      recentCalls.delete(key);
    }
  }
}, 30000); // Cada 30 segundos

// toda la logica del loadder /me en root
export async function getUserFromRequest(
  request: Request
): Promise<UserResponseHandler | UserErrorHandler> {
  const url = new URL(request.url);
  console.log("getUserFromRequest LLAMADO - URL:", url.pathname);

  // esto es la cookie AUTH_TOKEN=sjfdklj
  const cookieHeader = getHeaderCookie(request);

  console.log("DOCUMENT COOKIE", cookieHeader);

  // Verificar caché primero
  const cacheKey = cookieHeader || "NO_COOKIE";
  const cached = userCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("USANDO CACHE - No llamada al servidor, data:" + JSON.stringify(cached.data));
    
    return cached.data;
  }

  // Verificar llamadas duplicadas muy rápidas
  const now = Date.now();
  const lastCall = recentCalls.get(cacheKey);

  if (lastCall && now - lastCall < DUPLICATE_CALL_THRESHOLD) {
    console.log(
      "LLAMADA DUPLICADA DETECTADA - Usando caché aunque esté expirado"
    );
    if (cached) {
      return cached.data;
    }
  }

  // Registrar esta llamada
  recentCalls.set(cacheKey, now);

  if (cookieHeader == null) {
    const res = {
      succes: false,
      status: "error",
      message: "No cookie header found",
    } as UserErrorHandler;

    // Guardar error en caché con clave especial para "sin cookie"
    userCache.set("NO_COOKIE", {
      data: res,
      timestamp: Date.now(),
    });

    return res;
  }

  const isTokenValid = verifyTokenFromCookie(cookieHeader);

  if (isTokenValid !== undefined) {
    const res = {
      succes: false,
      status: isTokenValid.status,
      message: isTokenValid.message,
    } as UserErrorHandler;
    return res;
  }

  const token = getTokenFromCookie(cookieHeader);

  if (token == null) {
    const res = {
      succes: false,
      status: "error",
      message: "No token found",
    } as UserErrorHandler;
    return res;
  }
  console.log("NOSESIESTOKEN:", token);

  //logeateeeeeeeeeee
  console.log("en me" + JSON.stringify(token));


  // en caso de que sea valido el token y no sea null
  // por decodeClaims
  // decodificar el token
  // y si hay error devolver el error
  const jwtPayload = decodeClaims(token);
  console.log("JWT PAYLOAD", jwtPayload);

  try {
    console.log("LLAMANDO A fetchMe (servidor Spring Boot)");
    const response = await fetchMe(cookieHeader);
    console.log(" response de me", response);
    
    // por si es UserErrorResponse
    if ("message" in response && "status" in response) {
      const res = {
        succes: false,
        status: response?.status,
        message: response?.message,
      } as UserErrorHandler;
      return res;
    }

    if (jwtPayload.valid) {
      // en caso de que sea valido el token
      const user = {
        id: jwtPayload.payload.id_usuario.toString(),
        email: jwtPayload.payload.email,
        username: jwtPayload.payload.sub,
        role: jwtPayload.payload.role,
      } as User;

      console.log("result que se guardara en cahek", user);
      const result = {
        user: {
          id: jwtPayload.payload.id_usuario.toString(),
          email: jwtPayload.payload.email,
          username: jwtPayload.payload.sub,
          role: jwtPayload.payload.role,
        },
        status: "ok",
        message: "User found on SSR",
      } as UserResponseHandler;

      // Guardar en caché
      if (cookieHeader) {
        userCache.set(cookieHeader, {
          data: result,
          timestamp: Date.now(),
        });
        console.log("GUARDADO EN CACHE para authProvider");
      }

      return result;
    } else {
      return {
        succes: false,
        status: "error",
        message: "Error interno en ssr",
      } as UserErrorHandler;
    }
  } catch (err) {
    console.error("SSR Error in /me endpoint:", err);
    return {
      succes: false,
      status: "unexpected error",
      message: "SSR Error in /me endpoint, error: " + err,
    };
  }
}

// jwtPayload.payload.error.jwtPayload.code, { status: 200 });
