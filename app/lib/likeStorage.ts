/**
 * Utilidad para gestionar likes en localStorage
 * Soporta likes de posts y comentarios
 */

const LIKES_KEY = "user_likes";
const COMMENT_LIKES_KEY = "user_comment_likes";

// ============ POSTS ============

export function getUserLikes(): Set<number> {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = localStorage.getItem(LIKES_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
}

export function addLike(postId: number): boolean {
  if (typeof window === "undefined") return false;

  const likes = getUserLikes();

  // Verificar si ya tiene like
  if (likes.has(postId)) {
    console.log(`[LIKE] Post ${postId} ya tiene like, ignorando`);
    return false;
  }

  likes.add(postId);
  localStorage.setItem(LIKES_KEY, JSON.stringify([...likes]));
  console.log(`[LIKE] Like agregado al post ${postId}`);
  return true;
}

export function removeLike(postId: number): boolean {
  if (typeof window === "undefined") return false;

  const likes = getUserLikes();

  // Verificar si tiene like antes de remover
  if (!likes.has(postId)) {
    console.log(`[LIKE] Post ${postId} no tiene like, ignorando`);
    return false;
  }

  likes.delete(postId);
  localStorage.setItem(LIKES_KEY, JSON.stringify([...likes]));
  console.log(`[LIKE] Like removido del post ${postId}`);
  return true;
}

export function hasLike(postId: number): boolean {
  return getUserLikes().has(postId);
}

export function toggleLike(postId: number): boolean {
  const hasLiked = hasLike(postId);
  if (hasLiked) {
    removeLike(postId);
  } else {
    addLike(postId);
  }
  return !hasLiked; // Retorna el nuevo estado
}

// ============ COMENTARIOS ============

export function getUserCommentLikes(): Set<number> {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = localStorage.getItem(COMMENT_LIKES_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
}

export function addCommentLike(commentId: number): boolean {
  if (typeof window === "undefined") return false;

  const likes = getUserCommentLikes();

  // Verificar si ya tiene like
  if (likes.has(commentId)) {
    console.log(`[LIKE] Comentario ${commentId} ya tiene like, ignorando`);
    return false;
  }

  likes.add(commentId);
  localStorage.setItem(COMMENT_LIKES_KEY, JSON.stringify([...likes]));
  console.log(`[LIKE] Like agregado al comentario ${commentId}`);
  return true;
}

export function removeCommentLike(commentId: number): boolean {
  if (typeof window === "undefined") return false;

  const likes = getUserCommentLikes();

  // Verificar si tiene like antes de remover
  if (!likes.has(commentId)) {
    console.log(`[LIKE] Comentario ${commentId} no tiene like, ignorando`);
    return false;
  }

  likes.delete(commentId);
  localStorage.setItem(COMMENT_LIKES_KEY, JSON.stringify([...likes]));
  console.log(`[LIKE] Like removido del comentario ${commentId}`);
  return true;
}

export function hasCommentLike(commentId: number): boolean {
  return getUserCommentLikes().has(commentId);
}

export function toggleCommentLike(commentId: number): boolean {
  const hasLiked = hasCommentLike(commentId);
  if (hasLiked) {
    removeCommentLike(commentId);
  } else {
    addCommentLike(commentId);
  }
  return !hasLiked; // Retorna el nuevo estado
}

// ============ UTILIDADES ============

export function clearLikes(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LIKES_KEY);
  localStorage.removeItem(COMMENT_LIKES_KEY);
  console.log("[LIKE] Todos los likes limpiados");
}
