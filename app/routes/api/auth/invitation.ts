import { generateToken, invites } from "~/features/admin/adminRegisterInvitation";
const EXPIRATION_TIME = 12 // horas  expira a las 12 horas

export async function action({ request }) {
  const { email } = await request.json();
  const token = generateToken();
  const now = Date.now();
  const expiresAt = now  + EXPIRATION_TIME * 60 * 60 * 1000;
  
  invites.set(token, {
    email,
    used: false,
    createdAt: now,
    expiresAt: expiresAt
  })

  // retornar token json y invite
  return Response.json({
    token,
    expiresAt,
    link: `/admin-register/invite/${token}`
  })
  

}
