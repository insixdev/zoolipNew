/** ID de publicación asociada al comentario */
type PublicationId = {
  id_publicacion: number;
};

/** ID de usuario que hace el comentario */
type UserId = {
  id: number;
};

/**
 * Request para crear un nuevo comentario
 */
export type CommentCreateRequest = {
  id_publicacion: PublicationId;
  id_usuario: UserId;
  contenido: string;
  fecha_comentario: string;
};

/**
 * Request para actualizar un comentario existente
 */
export type CommentUpdateRequest = {
  id_comentario: number;
  contenido: string;
};

/**
 * Request para eliminar un comentario
 */
export type CommentDeleteRequest = {
  id_comentario: number;
};

/**
 * Response estándar para operaciones CRUD (crear, actualizar, eliminar)
 */
export type CommentResponse = {
  status: string;
  httpCode: number;
  message: string;
};

/**
 * Response al obtener comentarios (getAll y getById)
 */
export type CommentGetResponse = {
  id_comentario?: number;
  idComentario?: number; // Backend usa este nombre
  contenido: string;
  fecha_comentario?: string;
  nombreUsuario?: string; // Nombre del usuario que comentó
  nombre_usuario?: string; // Variante snake_case
  idPublicacion?: number; // ID de la publicación
  id_usuario?: number; // ID del usuario que comentó
  idUsuario?: number; // Variante camelCase
  rolUsuario?: string; // Rol del usuario que comentó
  rol_usuario?: string; // Variante snake_case
  imagen_usuario?: string; // Avatar del usuario que comentó
  imagenUsuario?: string; // Variante camelCase
  imagen_url?: string; // URL de imagen alternativa
  imagenUrl?: string; // Variante camelCase
};
