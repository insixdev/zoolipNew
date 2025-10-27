import type { ActionFunctionArgs } from "react-router";

const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:3050/api/auth';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    
    // Validar que tenemos los datos necesarios
    if (!body.username || !body.password) {
      return Response.json(
        { status: 'error', message: 'Username y password son requeridos' },
        { status: 400 }
      );
    }

    // Hacer la petición al backend de Spring
    const response = await fetch(`${SPRING_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { status: 'error', message: data.message || 'Error en la autenticación' },
        { status: response.status }
      );
    }

    // Obtener el token
    const token = data.token || response.headers.get('Authorization')?.replace('Bearer ', '');
    
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
      user: data.user // Asumiendo que el backend devuelve los datos del usuario
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
