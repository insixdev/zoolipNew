/** ID compuesto para identificar una atención */
export type AtencionId = {
  idDiagnostico: number;
  idVeterinario: number;
  idMascota: number;
};

/** ID de diagnóstico */
type DiagnosticId = {
  id_diagnostico: number;
};

/** ID de veterinario */
type VeterinarianId = {
  id_veterinario: number;
};

/** ID de mascota */
type PetId = {
  id: number;
};

/**
 * Request para iniciar una nueva atención
 */
export type AtencionCreateRequest = {
  diagnostico: DiagnosticId;
  veterinario: VeterinarianId;
  mascota: PetId;
  fecha_inicio: string;
  motivo_consulta: string;
};

/**
 * Request para actualizar una atención existente
 */
export type AtencionUpdateRequest = {
  id: AtencionId;
  motivo_consulta: string;
};

/**
 * Request para completar una atención
 */
export type AtencionCompleteRequest = {
  id: AtencionId;
  fecha_final: string;
};

/**
 * Request para eliminar una atención
 */
export type AtencionDeleteRequest = {
  id: AtencionId;
};

/**
 * Response estándar para operaciones CRUD (crear, actualizar, eliminar, completar)
 */
export type AtencionResponse = {
  status: string;
  httpCode: number;
  message: string;
};

/**
 * Response al obtener atenciones (getAll y getById)
 */
export type AtencionGetResponse = {
  fecha_inicio: string;
  fecha_final: string;
  motivo_consulta: string;
};
