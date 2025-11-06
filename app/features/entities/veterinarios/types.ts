/** ID de institución asociada al veterinario */
type InstitutionId = {
  id_institucion: number;
};

/**
 * Request para crear un nuevo veterinario
 */
export type VeterinarianCreateRequest = {
  nombre: string;
  id_institucion: InstitutionId;
};

/**
 * Request para actualizar un veterinario existente
 */
export type VeterinarianUpdateRequest = {
  id_veterinario: number;
  nombre: string;
  id_institucion: InstitutionId;
};

/**
 * Response estándar para operaciones CRUD (crear, actualizar, eliminar)
 */
export type VeterinarianResponse = {
  status: string;
  httpCode: number;
  message: string;
};

/**
 * Response al obtener veterinarios (getAll y getById)
 */
export type VeterinarianGetResponse = {
  id_veterinario: number;
  nombre: string;
};
