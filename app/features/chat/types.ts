/**
 * Tipos para el servicio de chats
 */

export interface ChatCreateRequest {
  id_chat: number;
  nombreChat: string;
  usuario: {
    id: number;
  };
  administrador: {
    id: number;
  };
}

export interface ChatResponse {
  status: string;
  httpCode: number;
  message: string;
}

export interface ChatGetResponse {
  id_chat: number;
  nombreChat: string;
}

export interface MessageGetResponse {
  id_mensaje: number;
  contenido: string;
  fecha_envio: string;
}
