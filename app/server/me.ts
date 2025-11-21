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
import {
  getInstitutionByIdService,
  getInstitutionByIdUsuarioService,
} from "~/features/entities/institucion/institutionService";
async function fetchInstitutionServiceForRole(id: number, cookie) {
  try {
    const data = await getInstitutionByIdService(id, cookie);
    if (data.tipo == "REFUGIO") {
      return { institution: "ROLE_REFUGIO" };
    } else if (data.tipo == "VETERINARIA") {
      return { institution: "ROLE_VETERINARIA" };
    } else {
      return { institution: null };
    }
  } catch (err) {
    return { institution: null };
  }
}
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

const CACHE_DURATION = 3 * 60 * 1000; // 5 minutos - más agresivo
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
    const username =
      "user" in cached.data ? cached.data.user?.username : "sin usuario";
    console.log(
      "[CACHE] Usando cache - No llamada al servidor, usuario:",
      username
    );
    console.log("[CACHE] imagen_url en cache:", cached.data.user?.imagen_url);

    return cached.data;
  } else if (cached) {
    console.log("Cache expirado, obteniendo datos frescos del servidor");
  } else {
    console.log("No hay cache, obteniendo datos del servidor");
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
      let role = jwtPayload.payload.role; // default role

      // Si es ROLE_ADMINISTRADOR, verificar el tipo de institución
      if (role === "ROLE_ADMINISTRADOR") {
        console.log("Admin detectado, verificando tipo de institución:");
        const institutionData = await getInstitutionByIdUsuarioService(
          jwtPayload.payload.id_usuario,
          cookieHeader
        );

        if (institutionData.tipo) {
          role = `ROLE_${institutionData.tipo}`;
          console.log(" Rol específico asignado:", role);
        }
      }

      // Extraer biografia e imagen_url de la respuesta del endpoint /me
      // El backend devuelve imagenUrl (camelCase), no imagen_url (snake_case)
      const responseObj = response as any;
      
      console.log("[me.ts] RESPONSE OBJ:", responseObj);
      
      const biografia = responseObj.biografia || null;
      let imagen_url = responseObj.imagenUrl || null;

      console.log("[me.ts] EXTRACCION COMPLETA:", {
        biografia,
        imagen_url,
      });

      // Las imágenes se guardan en public/upload
      // Usar solo rutas relativas /upload/
      let fullImageUrl = imagen_url;
      if (imagen_url) {
        if (!imagen_url.startsWith("/upload/")) {
          fullImageUrl = `/upload/${imagen_url}`;
        }
        // Si no tiene extensión, agregar .png por defecto
        if (fullImageUrl && !fullImageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          fullImageUrl += ".png";
        }
      }
      console.log("[me.ts] imagen_url final:", fullImageUrl);

      // en caso de que sea valido el token
      const user = {
        id: jwtPayload.payload.id_usuario.toString(),
        email: jwtPayload.payload.email,
        username: jwtPayload.payload.sub,
        role: role,
        biografia: biografia,
        imagen_url: fullImageUrl,
      } as User;
      
      console.log("[me.ts] Usuario construido con campos:", {
        id: user.id,
        username: user.username,
        biografia: user.biografia,
        imagen_url: user.imagen_url,
      });

      console.log("result que se guardara en cache", {
        userBiografia: user.biografia,
        userImagenUrl: user.imagen_url,
      });
      
      const result = {
        user: {
          id: jwtPayload.payload.id_usuario.toString(),
          email: jwtPayload.payload.email,
          username: jwtPayload.payload.sub,
          role: role,
          biografia: biografia,
          imagen_url: fullImageUrl,
        },
        status: "ok",
        message: "User found on SSR",
      } as UserResponseHandler;

      console.log("[me.ts] Result a guardar en cache:", result.user);

      // Guardar en caché
      if (cookieHeader) {
        userCache.set(cookieHeader, {
          data: result,
          timestamp: Date.now(),
        });
        console.log("✓ GUARDADO EN CACHE para authProvider", {
          biografia: result.user.biografia,
          imagen_url: result.user.imagen_url,
        });
      }
      console.log(
        "NOOOOOOOOO USNADOCACHE - CON LLAMADA data:" + JSON.stringify(result)
      );

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