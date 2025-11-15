import crypto from "crypto"
import { AdminRole } from "~/lib/constants";

export interface invite {
  email: string,
  role: string,
  used: boolean,
  systemCookie: string,
  createdAt: number, 
  expiresAt: number,
}
/** sera solo temporal en tiempo de ejecucion del servidor web */
export const invites = new Map<string, invite>

/**
 * Genera un token aleatorio*/
export function generateInviteToken(): string{
  const token = crypto.randomBytes(16).toString("hex")
  // verificar si el token ya esta en uso o no 
  if(invites.has(token)){
    return generateInviteToken() // se genera uno nuevo
  }
  return token;
}

export class valideResponse  {
  email: string
  role: string 
  expiresAt: number
  private valid: boolean
  isValid() {
    return this.valid
  }

  constructor(email: string, expiresAt: number, valid: boolean, role: string){
    this.role = role
    this.email = email,
    this.expiresAt = expiresAt,
    this.valid = valid
    
  }
}
export function existingInvite(email: string){
  if(invites.has(email)){
    return true
  }
  return false
  
}
export function addInvite(email: string, role: string, expiresAt: number, systemToken: string){

  const token = generateInviteToken()
  invites.set(token, {
    systemCookie: systemToken,
    email,
    role,
    used: false,
    createdAt: Date.now(),
    expiresAt
  })
  return token
  
}
export function validateToken(token: string ){ {
  const invite = invites.get(token)
  if(invite === undefined){
    return {message:"Token no valido", status: 498 }
  }

  const now = Date.now();
  if(now > invite.expiresAt){ // expirado
    return {message:"Token expirado", status: 400 }
  }
  if(invite.used){
    return {message:"Token ya utilizado", status: 400}  
  }
  invite.used = true;
  const systemToken = invite.systemCookie;

  const valide: valideResponse = new valideResponse(
     invite.email,
    invite.expiresAt,
    true,
    invite.role,

  )
  console.log("MITOKENNNNNNNNNNNNNNNNNNNNNNNNNNNN,", systemToken);

  return {
    valide,
    systemToken
  }
}
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

