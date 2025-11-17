/** Tipo de institución */
export enum InstitutionType {
  refugio = "ROLE_REFUGIO",
  veterinaria = "ROLE_VETERINARIA",
  protectora = "ROLE_PROTECTORA",
}
export type idadmin = {
  id: number;
}
/**
 * Request para agregar una nueva institución
 */
export type InstitutionCreateRequest = {
  id_usuario: idadmin;
  nombre: string;
  tipo: InstitutionType;
  email: string;
  descripcion: string;
  horario_inicio: string;
  horario_fin: string;
};

/**
 * Request para actualizar una institución existente
 */
export type InstitutionUpdateRequest = {
  id_institucion: number;
  nombre: string;
  tipo: InstitutionType;
  email: string;
  descripcion: string;
  horario_inicio: string;
  horario_fin: string;
};

/**
 * Response estándar para operaciones CRUD (crear, actualizar, eliminar)
 */
export type InstitutionResponse = {
  status: string;
  httpCode: number;
  message: string;
};

/**
 * Response al obtener instituciones (getAll y getById)
 */
export type InstitutionGetResponse = {
  id_institucion: number;
  nombre: string;
  tipo: string;
  email: string;
  descripcion: string;
  horario_Inicio: string; // Backend devuelve con mayúscula
  horario_Fin: string; // Backend devuelve con mayúscula
};

/** Tipos de solicitud de institución */
export enum InstitutionSolicitudType {
  REFUGIO = "REFUGIO",
  VETERINARIA = "VETERINARIA",
}

/**
 * Request para crear una solicitud de institución
 * Esto es lo que envía un usuario que quiere registrar su institución
 */
export type InstitutionSolicitudCreateRequest = {
  nombre_institucion: string;
  tipo: InstitutionSolicitudType | string;
  email_contacto: string;
  telefono_contacto: string;
  razon_solicitud: string;
};

/**
 * Request para actualizar una solicitud de institución (admin)
 */
export type InstitutionSolicitudUpdateRequest = {
  id_solicitud: number;
  estado: "PENDIENTE" | "ACEPTADA" | "RECHAZADA";
  motivo_rechazo?: string;
};

/**
 * Response al crear/actualizar solicitud
 */
export type InstitutionSolicitudResponse = {
  status: string;
  httpCode: number;
  message: string;
  id_solicitud?: number;
};

/**
 * Response al obtener una solicitud
 */
export type InstitutionSolicitudGetResponse = {
  id_solicitud: number;
  nombre_institucion: string;
  tipo: string;
  email_contacto: string;
  telefono_contacto: string;
  razon_solicitud: string;
  estado: string;
  fecha_creacion: string;
  fecha_ultima_actualizacion: string;
  motivo_rechazo?: string;
};
