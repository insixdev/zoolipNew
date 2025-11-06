/** Estado de la donación */
export enum DonationStatus {
  pending = "PENDIENTE",
  completed = "COMPLETADA",
  cancelled = "CANCELADA",
}

/** ID de usuario que realiza la donación */
type UserId = {
  id: number;
};

/** ID de institución que recibe la donación */
type InstitutionId = {
  id_institucion: number;
};

/**
 * Request para crear una nueva donación
 */
export type DonationCreateRequest = {
  id_usuario: UserId;
  id_institucion: InstitutionId;
  monto: number;
  status: DonationStatus;
  fecha_inicio: string;
  fecha_final?: string;
};

/**
 * Request para actualizar una donación existente
 */
export type DonationUpdateRequest = {
  id_donacion: number;
  status: DonationStatus;
  monto: number;
  fecha_final?: string;
};

/**
 * Response estándar para operaciones CRUD (crear, actualizar, eliminar)
 */
export type DonationResponse = {
  status: string;
  httpCode: number;
  message: string;
};

/**
 * Response al obtener donaciones (getAll y getById)
 */
export type DonationGetResponse = {
  id_donacion: number;
  status: string;
  monto: number;
  fecha_inicio: string;
  fecha_final?: string;
};
