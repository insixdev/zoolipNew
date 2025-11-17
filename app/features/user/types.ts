/**
 * Tipos para el servicio de usuarios
 */
export interface UserUpdateRequest {
  id: number;
  nombre?: string;
  email?: string;
  rol?: string;
  imagen_url?: string;
  biografia?: string;
}

export interface UserResponse {
  status: string;
  httpCode: number;
  message: string;
}

export interface UserGetResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  imagen_url?: string;
  biografia?: string;
}
