// Tipos para el sistema de adopción

export type MascotaId = {
  id: number;
};

export type UsuarioId = {
  id: number;
};

export type InstitucionId = {
  id_institucion: number;
};

/**
 * DTO de Mascota que viene del backend
 */
export type MascotaDTO = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  id_institucion: number;
  descripcion?: string;
  imagen_url?: string;
  sexo?: string;
  tamanio?: string;
  estado?: string;
  fecha_registro?: string;
};

/**
 * Request para crear/actualizar mascota
 */
export type MascotaRequest = {
  id?: number;
  nombre: string;
  raza: string;
  edad: number;
  id_institucion: InstitucionId;
  descripcion?: string;
  imagen_url?: string;
  sexo?: string;
  tamanio?: string;
};

/**
 * DTO de Solicitud de Adopción (del backend)
 */
export type SolicitudAdopcionDTO = {
  idSolicitudAdopcion: number;
  nombreSolicitante: string;
  idMascota: number;
  estadoSolicitud: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "COMPLETADA";
  fecha_inicio: string;
  fecha_finalizado?: string;
};

/**
 * Request para crear solicitud de adopción
 */
export type SolicitudAdopcionRequest = {
  id?: number;
  id_mascota: MascotaId;
  id_usuario: UsuarioId;
  estado?: string;
  fecha_solicitud?: string;
};

/**
 * Response estándar del backend
 */
export type Response = {
  status: string;
  httpCode: number;
  message: string;
};
