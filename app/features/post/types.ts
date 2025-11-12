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
export type UserIdPost = {
  id: number;
};

/**
 * Request para crear una nueva publicación
 */
export type PublicationCreateRequest = {
  id_usuario: UserIdPost;
  tipo: "CONSULTA" | "PUBLICACION";
  imagen_url: string;
  fecha_edicion: string;
  fecha_duda_resuelta: string;
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

/**
 * Response al obtener publicaciones públicas
 */
export type PublicationPublicGetResponse = {
  id_publicacion: number;
  topico: string;
  contenido: string;
  nombreUsuario: string;
  likes: number;
  fecha_pregunta: string;
  fecha_duda_resuelta: string | null;
  fecha_edicion: string | null;
};
