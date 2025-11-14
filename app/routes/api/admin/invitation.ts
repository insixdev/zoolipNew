import { ActionFunctionArgs } from "react-router";
import {
  addInvite,
  existingInvite,
} from "~/features/admin/adminRegisterInvitation";
import { UserResponseHandler } from "~/features/entities/User";
import { ADMIN_ROLES, AdminRole } from "~/lib/constants";
import { getUserFromRequest } from "~/server/me";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const tipo = formData.get("tipo") as string;
    const organizacion = formData.get("organizacion") as string;

    // Validaciones del servidor
    if (!email || !tipo) {
      return Response.json(
        { error: "Todos los campos obligatorios deben ser completados" },
        { status: 400 }
      );
    }

    // Validar que el tipo sea válido en el form
    const validTypes = Object.values(ADMIN_ROLES);
    if (!validTypes.includes(tipo as any)) {
      return Response.json(
        { error: "Tipo de administrador inválido" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Formato de correo electrónico inválido" },
        { status: 400 }
      );
    }

    // hacer verificacion de rol obteniendo en ssr aunque gaste mas
    // recurosos pero es mas seguro
    const roleCurrent = getUserFromRequest(request);
    if (!roleCurrent) {
      return Response.json({ error: "No autorizado" }, { status: 403 });
    }
    if (roleCurrent instanceof UserResponseHandler) {
      if (roleCurrent.user.role !== ADMIN_ROLES.ADMINISTRADOR) {
        return Response.json(
          { error: "No autorizado tienes que ser administrador" },
          { status: 403 }
        );
      }
    }

    if (existingInvite(email)) {
      return Response.json(
        { error: "Ya existe una invitación para este correo" },
        { status: 400 }
      );
    }
    // Generar token único

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días
    console.log("tipo:", tipo);

    const token = addInvite(email, tipo, expiresAt.getTime());

    // TODO: Enviar email con el link de invitación
    // await sendInvitationEmail(email, nombre, inviteLink);

    const inviteLink = `${new URL(request.url).origin}/admin-register/invite/${token}`;

    console.log("Invitación creada:", {
      email,
      tipo,
      organizacion,
      expiresAt,
    });

    return Response.json({ inviteLink });
  } catch (error) {
    console.error("Error al generar invitación:", error);
    return Response.json(
      { error: "Error al generar la invitación. Intenta nuevamente." + error },
      { status: 500 }
    );
  }
}
