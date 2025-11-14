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
  idPublicacion?: number; // ID de la publicación
};
