import crypto from "crypto"

export interface invite {
  email: string,
  used: boolean,
  createdAt: number, 
  expiresAt: number,
}
/** sera solo temporal en tiempo de ejecucion del servidor web */
export const invites = new Map<string, invite>

/**
 * Genera un token aleatorio*/
export function generateToken(): string{
  const token = crypto.randomBytes(16).toString("hex")
  // verificar si el token ya esta en uso o no 
  if(invites.has(token)){
    return generateToken()
  }
  return token;
}

export class valideResponse  {
  email: string
  expiresAt: number
  private valid: boolean
  isValid() {
    return this.valid
  }

  constructor(email: string, expiresAt: number, valid: boolean){
    this.email = email,
    this.expiresAt = expiresAt,
    this.valid = valid
  }
}

export function validateToken(token: string ) {
  const invite = invites.get(token)
  if(!invite){
    return {message:"Token no valido", status: 400 }
  }
  const now = Date.now();
  if(now > invite.expiresAt){ // expirado
    return {message:"Token expirado", status: 400 }
  }
  if(invite.used){
    return {message:"Token ya utilizado", status: 400}  
  }
  invite.used = true;

  return new valideResponse(
    invite.email,
    invite.expiresAt,
    true
  )
  
}
/**
 * limpia las invitaciones expiradas
 * */
export function cleanExpiratedInvites(){
  const now = Date.now();
  invites.forEach((invite, token) => {
    if(now > invite.expiresAt){
      invites.delete(token)
    }
  })
}
