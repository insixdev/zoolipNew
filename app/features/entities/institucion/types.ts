/** Tipo de institución */
export enum InstitutionType {
  refugio = "REFUGIO",
  veterinaria = "VETERINARIA",
  protectora = "PROTECTORA",
}

/** ID de usuario asociado a la institución */
export type UserId = {
  id: number;
};

/**
 * Request para agregar una nueva institución
 */
export type InstitutionCreateRequest = {
  id_usuario: UserId;
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
  horario_inicio: string;
  horario_fin: string;
};
