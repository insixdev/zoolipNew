import { request } from "http";
import { verifyToken } from "~/lib/authUtil";
import { HandleData } from "~/routes/api/auth/login";

// app/server/cookies.ts
export type getAuthTokenResponse = {
  token: string | null;
  message: string;
};
export type errorResponse = {
  status: string;
  message: string;
}
/*
 * verificar que el token sea valido
 * @param cookieValue 
 * return: Response if token is not valid or null 
 * */
function verifyResponse(token: string): undefined | errorResponse {
  console.log("antes de COOKIE VALUE EN VEERIFY: " + token);

  console.log("depues de TOKEN EN VERIFY: " + token);
  if (token != null) {
    console.log(token);
    const isTokenValid = verifyToken(token);
    if (!isTokenValid) {
      return {
        status: "error",
        message: "Token is not valid",
      } as errorResponse;
    }
    return undefined //suc
  } else {
    return {
      status: "error",
      message: "Cookie Header not found",
    }
  }
}
/**
* Obtener el token después del login exitoso de los 
* headers que ya manda react-router
* verificamos el token si es valido
* y devolvemos un error si no lo es 
* return: undefined si esta todo correcto
* o Response 
* con el error
* */
export function verifyTokenFromCookie(cookie: string) {
  console.log("verifying token::: ", cookie); // aca si funca


  const cookieValue = getTokenFromCookie(cookie);

  console.log("WOKRIN", cookieValue)

  if (cookieValue == null) {
    return {
        status: "error",
        message: "Token in cookie not found",
      }
  } 

  return verifyResponse(cookieValue);

}



// simplemente obtiene el header
// de las cookies AUTH_TOKEN

/**
 * getTokenFromCookie
 * obtiene el token de la cookie
 * example: AUTH_TOKEN=abc123
 * returns: abc123
 **/
export function getTokenFromCookie(cookie: string): string | null {

  if (cookie == null) { console.log("No cookie header found");return null;}
  const cookies = cookie.split("; ");

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key.trim() === "AUTH_TOKEN") {
      console.log("Cookie value:", value);
      return value; // la cookie entera ("AUTH_TOKEN=abc123")
    }
  }
  return null;

}


// req.headers.get("Cookie") obtener req del action ssr
// este nos da el cookie del navegador el guardado por el
// pero si queremos obtener la cookie de servidor princpal 
// tenemos que hacerlo por el tipo HandleData

/* 
 * getHeaderFromNavigator
 * esta funcion nos da el cookie de navegador
 *
 * */
export function getHeaderCookie(req: Request){

  const cookieHeader = req.headers.get("Cookie");
  return cookieHeader
}
