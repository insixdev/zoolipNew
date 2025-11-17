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
  id_mascota?: number; // Alternativa que puede venir del backend
  id_Mascota?: number; // Otra alternativa con M mayúscula
  nombre: string;
  raza: string;
  edad: number;
  id_institucion: number;
  descripcion?: string;
  imagen_url?: string;
  sexo?: string;
  especie?: string; // Alternativa a sexo
  tamanio?: string;
  estado?: string;
  estadoAdopcion?: string; // Estado de adopción del backend
  estadoSalud?: string; // Estado de salud
  fecha_registro?: string;
  ubicacion?: string;
  nombreInstitucion?: string; // Nombre de la institución
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
  estadoSolicitud: "SOLICITADA" | "APROBADO" | "RECHAZADO";
  fecha_inicio: string;
  fecha_finalizado?: string;
  motivo_decision?: string;
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
