import nodeemail from "nodemailer";

const zoolipEmail = process.env.EMAIL;
const password = process.env.PASSWORD;

const emailer = nodeemail.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: zoolipEmail,
    pass: password,
  },
});
/**
 * Email cuando se rechaza una solicitud de institución
 */
export async function solicitudRechazadaEmail(email: string, nombre: string) {
  try {
    if (
      zoolipEmail === "" ||
      zoolipEmail === undefined ||
      password === undefined
    ) {
      return {
        status: "internal error",
        mensaje: "no hay contraseña o email zoolip",
      };
    }

    const res = await emailer.sendMail({
      to: email,
      subject: "Actualización sobre tu solicitud - Zoolip",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Zoolip</h1>
          </div>
          
          <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Hola ${nombre},</h2>
            
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
              Gracias por tu interés en unirte a Zoolip como institución.
            </p>
            
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
              Lamentablemente, después de revisar tu solicitud, no podemos aprobarla en este momento. 
              Esto puede deberse a diversos factores relacionados con nuestros requisitos actuales.
            </p>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #991b1b; margin: 0; font-weight: 600;">
                Estado: Solicitud Rechazada
              </p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
              Si tienes alguna pregunta o deseas más información sobre esta decisión, 
              no dudes en contactarnos respondiendo a este correo.
            </p>
            
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
              Agradecemos tu comprensión y te deseamos mucho éxito en tus proyectos.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Atentamente,<br>
              <strong>El equipo de Zoolip</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Zoolip. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    console.log("Email de rechazo enviado:", res);
    return { status: "ok", mensaje: "email de rechazo enviado" };
  } catch (error) {
    return {
      status: "error",
      mensaje: "no se pudo enviar el email de rechazo",
      error,
    };
  }
}
/**
 * Email cuando se acepta una solicitud de institución con link de invitación
 */
export async function solicitudAceptadaConInvitacionEmail(
  email: string,
  nombre: string,
  invitationLink: string
) {
  try {
    if (
      zoolipEmail === "" ||
      zoolipEmail === undefined ||
      password === undefined
    ) {
      return {
        status: "internal error",
        mensaje: "no hay contraseña o email zoolip",
      };
    }

    const res = await emailer.sendMail({
      to: email,
      subject: "¡Felicidades! Tu solicitud ha sido aprobada - Zoolip",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Bienvenido a Zoolip!</h1>
          </div>
          
          <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">¡Excelentes noticias, ${nombre}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
              Nos complace informarte que tu solicitud para unirte a Zoolip como institución 
              ha sido <strong style="color: #059669;">aprobada exitosamente</strong>.
            </p>
            
            <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center;">
              <p style="color: #065f46; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                 Solicitud Aprobada
              </p>
              <p style="color: #047857; margin: 0; font-size: 14px;">
                Ya puedes completar tu registro y comenzar a usar la plataforma
              </p>
            </div>
            
            <h3 style="color: #1f2937; margin-top: 30px;">Próximos pasos:</h3>
            
            <ol style="color: #4b5563; line-height: 1.8; font-size: 16px;">
              <li>Haz clic en el botón de abajo para completar tu registro</li>
              <li>Crea tu cuenta de administrador</li>
              <li>Configura el perfil de tu institución</li>
              <li>¡Comienza a ayudar a las mascotas!</li>
            </ol>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${invitationLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                Completar Registro →
              </a>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; margin: 25px 0; border-radius: 6px;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong> Importante:</strong> Este enlace de invitación es único y tiene una validez limitada. 
                Por favor, completa tu registro lo antes posible.
              </p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
              Si tienes alguna pregunta o necesitas ayuda durante el proceso de registro, 
              no dudes en contactarnos respondiendo a este correo.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              ¡Estamos emocionados de tenerte en nuestra comunidad!<br>
              <strong>El equipo de Zoolip</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 Zoolip. Todos los derechos reservados.</p>
            <p style="margin-top: 10px;">
              Si no solicitaste unirte a Zoolip, puedes ignorar este correo.
            </p>
          </div>
        </div>
      `,
    });

    return { status: "ok", mensaje: "email de aceptación enviado" };
  } catch (error) {
    return {
      status: "error",
      mensaje: "no se pudo enviar el email de aceptación",
      error,
    };
  }
}

export function newUserEmail(email: string, nombre: string) {
  const res = emailer.sendMail({
    to: email,
    subject: "Bienvenido a Zoolip",
    text: `Hola ${nombre} te damos la bienvenida a Zoolip, `,
  });
}
/*
 * cuando se hizo una solicitud de institucion con un mensaje de bienvenida
 * */
export async function solicitudeSuccesInstitutionEmail(
  email: string,
  nombre: string
) {
  try {
    if (
      zoolipEmail === "" ||
      zoolipEmail === undefined ||
      password === undefined
    )
      return {
        status: "internal error",
        mensaje: "no hay contraseña o email zoolip",
      };

    const res = await emailer.sendMail({
      to: email,
      subject: "Bienvenido a Zoolip",
      text: `Hola ${nombre}, te contactaremos pronto si tu solicitud fue aprobada`,
    });
    console.log(res);
    return { status: "ok", mensaje: "email de bienvenida enviado" };
  } catch (error) {
    return {
      status: "error",
      mensaje: "no se pudo enviar el email de bienvenida, error:",
      error,
    };
  }
}
