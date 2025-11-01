import type { ActionFunctionArgs } from "react-router";

const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:3050/api/auth';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    
    // Validaciones básicas
    if (!body.username || !body.password || !body.email) {
      return Response.json(
        { status: 'error', message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return Response.json(
        { status: 'error', message: 'Formato de correo electrónico inválido' },
        { status: 400 }
      );
    }

    // Validar fortaleza de contraseña
    if (body.password.length < 8) {
      return Response.json(
        { status: 'error', message: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    const response = await fetch(`${SPRING_API_URL}/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { 
          status: 'error', 
          message: data.message || 'Error en el registro',
          errors: data.errors || null
        },
        { status: response.status }
      );
    }

    return Response.json(
      { 
        status: 'success', 
        message: 'Registro exitoso',
        user: data.user // Asumiendo que el backend devuelve los datos del usuario
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error en registro:', err);
    return Response.json(
      { status: 'error', message: 'Error en el servidor durante el registro' },
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
