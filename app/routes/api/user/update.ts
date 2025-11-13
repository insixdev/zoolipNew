import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return Response.json(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const userData = {
      id: parseInt(formData.get("id") as string),
      nombre: formData.get("nombre") as string,
      email: formData.get("email") as string,
      rol: formData.get("rol") as string,
      imagen_url: (formData.get("imagen_url") as string) || null,
      biografia: (formData.get("biografia") as string) || null,
    };

    console.log("Actualizando usuario:", userData);

    const response = await fetch(
      "http://localhost:3050/api/usuario/actualizar",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify(userData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        { success: false, error: result.message || "Error al actualizar" },
        { status: response.status }
      );
    }

    return Response.json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: result,
    });
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return Response.json(
      { success: false, error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}
