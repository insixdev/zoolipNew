/** Estado de una publicación/duda */
export enum PublicationState {
  open = "ABIERTA",
  resolved = "RESUELTA",
  closed = "CERRADA",
}

/** Categoría o tópico de la publicación */
export enum TopicCategory {
  health = "SALUD",
  behavior = "COMPORTAMIENTO",
  nutrition = "NUTRICION",
  adoption = "ADOPCION",
  general = "GENERAL",
}

/** Tipo de usuario asociado a la publicación */
type UserId = {
  id: number;
};

/**
 * Request para crear una nueva publicación
 */
export type PublicationCreateRequest = {
  id_usuario: UserId;
  topico: string;
  contenido: string;
  likes: number;
  fecha_pregunta: string;
};

/**
 * Request para actualizar una publicación existente
 */
export type PublicationUpdateRequest = {
  id_publicacion: number;
  topico: string;
  contenido: string;
  likes: number;
  fecha_edicion: string;
};

/**
 * Response estándar para operaciones CRUD (crear, actualizar, eliminar)
 */
export type PublicationResponse = {
  status: string;
  httpCode: number;
  message: string;
};

/**
 * Response al obtener publicaciones (getAll y getById)
 */
export type PublicationGetResponse = {
  id_publicacion: number;
  topico: string;
  contenido: string;
  likes: number;
  fecha_pregunta: string;
  fecha_edicion: string;
  fecha_duda_resuelta: string;
};
