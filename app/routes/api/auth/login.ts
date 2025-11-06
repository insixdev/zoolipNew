import { w } from "public/build/_shared/chunk-O7IRWV66";
import type { ActionFunctionArgs } from "react-router";
import { loginService } from "~/features/auth/authServiceCurrent";
import {
  UserServerResponseObj,
  type UserRequest,
  type UserResponse,
  type UserServerRequest,
  type UserServerResponse,
} from "~/features/entities/User";
import { getHeaderCookie, verifyTokenFromCookie } from "~/server/cookies";

/* tipo especial que contiene los headers y la response*/
export type HandleData = {
  response: UserResponse;
  headers: Headers;
};

/*validaaciones server ssr para el login */
async function handleLogin(
  req: UserServerRequest
): Promise<HandleData | Response> {
  const { username, password } = req;

  //code 400
  if (!username || !password) {
    return Response.json(
      { status: "error", message: "Username and password are required" },
      { status: 400 }
    );
  }

  try {
    const user = await loginService({ username, password });

    const userHeaders = user.headers;
    const finalUser = await user.json();

    if (finalUser.status === "error") {
      return Response.json(
        { status: finalUser.status, message: finalUser.message },
        { status: 401 }
      );
    }
    const finalResponse: HandleData = {
      response: finalUser,
      headers: userHeaders,
    };
    return finalResponse;
  } catch (err) {
    console.error("Login error:", err);

    // Retornar un error JSON en lugar de lanzar una Response
    return Response.json(
      {
        status: "error",
        message:
          err instanceof Error
            ? `Error de conexión: ${err.message}`
            : "Error de conexión con el servidor de autenticación",
      },
      { status: 500 }
    );
  }
}

/*ssr action for login*/
export async function action({ request }: ActionFunctionArgs) {
  try {
    // obtenemos la data
    const body = await request.formData();
    const userData: UserRequest = {
      username: body.get("username") as string,
      password: body.get("password") as string,
    };

    // Validar que tenemos los datos necesarios
    if (!userData.username?.trim()) {
      return Response.json(
        { status: "error", message: "El nombre de usuario es requerido" },
        { status: 400 }
      );
    }

    if (!userData.password) {
      return Response.json(
        { status: "error", message: "La contraseña es requerida" },
        { status: 400 }
      );
    }

    // validar que tenga minimamente 8 caracteres
    if (userData.password.length < 8) {
      return Response.json(
        {
          status: "error",
          message: "La contraseña debe tener al menos 8 caracteres",
        },
        { status: 400 }
      );
    }

    // Hacer login al servidor 
    const loginResponse = await handleLogin(userData as UserServerRequest);

    console.log(
      "DEBUG RESPONSE: EN SPRINGGBOOT " + JSON.stringify(loginResponse)
    );

    // si es una respuesta que esta es de error siempre
    // gracias a nuesto metodo
    // devolvemos error manejado por handleLogin
    if (loginResponse instanceof Response) {
      return loginResponse;
    }

    const userResponse: UserServerResponseObj = new UserServerResponseObj({
      status: loginResponse.response.status,
      message: loginResponse.response.message,
    } as UserServerResponse);

    if (userResponse.ok()) {
      return Response.json(
        {
          status: "error",
          message:
            loginResponse.response.message || "Error en la autenticación",
        },
        { status: 401 }
      );
    }

    const serverCookie = loginResponse.headers.get("Set-Cookie"); // AUTH_TOKEN

    const rawCookie = getHeaderCookie(request); // RAW solo el token

    if (serverCookie == null) {
      return Response.json(
        {
          status: "error",
          message:
            "Error de autenticación: No se pudo establecer la sesión. Intenta de nuevo.",
        },
        { status: 401 }
      );
    }

    // if (rawCookie == null) {
    //   return Response.json(
    //     {
    //       status: "error",
    //       message: "No se pudo parsear la cookie",
    //     },
    //     { status: 401 }
    //   );
    // }
    //validar el cookie nuevo del servidor
    const tokenValidation = verifyTokenFromCookie(serverCookie);
    if (tokenValidation !== undefined) {
      return Response.json({
        status: "error",
        message:
          tokenValidation.message ||
          "Token de autenticación inválido. Intenta iniciar sesión de nuevo.",
      });
    }
    // cookie es valido aqui

    // Preparar respuesta exitosa con cookie
    const responseData = {
      status: "success",
      message: "Inicio de sesión exitoso",
    };
    console.log("SUC");

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    // Establecer la cookie con el token
    console.log("Setting cookie:", rawCookie);
    console.log("Setting cookie SERVER :", serverCookie);

    headers.append("Set-Cookie", serverCookie);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Error en login:", err);

    // Determinar el mensaje de error basado en el tipo de error
    let errorMessage = "Error interno del servidor";

    if (err instanceof Error) {
      // si es un error de red o conexión
      if (err.message.includes("fetch") || err.message.includes("network")) {
        errorMessage =
          "Error de conexión con el servidor. Verifica tu conexión a internet.";
      } else if (err.message.includes("timeout")) {
        errorMessage =
          "El servidor tardo demasiado en responder. Intenta de nuevo.";
      } else {
        errorMessage = `Error interno del servidor: ${err.message}`;
      }
    }
    // finalmente le informamos al userrrrrrrr

    return Response.json(
      { status: "error", message: errorMessage },
      { status: 500 }
    );
  }
}

// Manejar solicitudes GET si es necesario
export async function loader() {
  return Response.json({ message: "Método no permitido" }, { status: 405 });
}
