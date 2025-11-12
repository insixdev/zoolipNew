import nodeemail from "nodemailer";

const zoolipEmail = process.env.EMAIL
const password = process.env.PASSWORD

const emailer = nodeemail.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: zoolipEmail,
    pass: password,
  },

})
/*
 * cuando se hizo una solicitud de institucion con un mensaje de bienvenida
 * */
export  async function solicitudeSuccesInstitutionEmail(email: string, nombre: string) {
  try{
    if(zoolipEmail=== "" || zoolipEmail === undefined || password === undefined) return {status: "internal error", mensaje: "no hay contraseña o email zoolip"}

    const res = await emailer.sendMail({
      to: email, subject: "Bienvenido a Zoolip", text: `Hola ${nombre} te damos la bienvenida a Zoolip, te contactaremos pronto`
    })
    console.log(res)
    return {status: "ok", mensaje: "email de bienvenida enviado"}
  }catch(error){
    return {status: "error", mensaje: "no se pudo enviar el email de bienvenida, error:", error}
  }


}
