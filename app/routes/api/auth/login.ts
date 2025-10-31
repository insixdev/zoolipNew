import type { ActionFunctionArgs } from "react-router";
import { UserServerResponseObj, type UserRequest, type UserResponse, type UserServerRequest, type UserServerResponse } from "~/features/user/User";
import { getAuthToken } from "~/server/cookies";
import { handleLogin } from "~/server/loginServer";

const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:3050/api/auth';
/*ssr action for login*/
export async function action({ request }: ActionFunctionArgs) {
  try {
    // Obtenemos el token de autenticación
    const token = getAuthToken(request)   
    const body: UserRequest  = await request.json();

    // Validar que tenemos los datos necesarios
    if (!body.username || !body.password) {
      return Response.json(
        { status: 'error', message: 'Username y password son requeridos' },
        { status: 400 }
      );
    }

    const user: UserResponse = await handleLogin(body as UserServerRequest)
    const response = {status: user.status, message: user.message}as UserServerResponse
    const userResponse: UserServerResponseObj = new UserServerResponseObj(response)

    if (!userResponse.ok) {
      return Response.json(
        { status: 'error', message: response.message || 'Error en la autenticación' },
      );
    }
    if (!token) {
      return Response.json(
        { status: 'error', message: 'No se recibió token de autenticación' },
        { status: 401 }
      );
    }

    // Devolvemos el token en la respuesta y dejamos que el cliente maneje la cookie
    // ya que en Remix manejamos las cookies a través de las funciones de carga
    const responseData = { 
      status: 'success', 
      message: 'Inicio de sesión exitoso',
      token,
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Set-Cookie', `AUTH_TOKEN=${token}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

    headers.append('Access-Control-Allow-Credentials', 'true');

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers
    });
  } catch (err) {
    console.error('Error en login:', err);
    return Response.json(
      { status: 'error', message: 'Error en el servidor durante el login' },
      { status: 500 }
    );
  }
}

// Manejar solicitudes GET si es necesario
export async function loader() {
  return Response.json(
    { message: 'Método no permitido' },
    { status: 405 }
  );
}
