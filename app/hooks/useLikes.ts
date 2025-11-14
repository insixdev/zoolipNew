import { useState, useEffect } from "react";

const LIKES_STORAGE_KEY = "zoolip_user_likes";

interface LikesData {
  posts: Set<string>;
  comments: Set<string>;
}

/**
 * Hook para manejar likes con localStorage
 * Guarda qué posts y comentarios tienen like del usuario
 */
export function useLikes() {
  const [likes, setLikes] = useState<LikesData>({
    posts: new Set(),
    comments: new Set(),
  });

  // Cargar likes desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLikes({
          posts: new Set(parsed.posts || []),
          comments: new Set(parsed.comments || []),
        });
      } catch (err) {
        console.error("Error loading likes from localStorage:", err);
      }
    }
  }, []);

  // Guardar likes en localStorage cuando cambien
  const saveLikes = (newLikes: LikesData) => {
    try {
      localStorage.setItem(
        LIKES_STORAGE_KEY,
        JSON.stringify({
          posts: Array.from(newLikes.posts),
          comments: Array.from(newLikes.comments),
        })
      );
      setLikes(newLikes);
    } catch (err) {
      console.error("Error saving likes to localStorage:", err);
    }
  };

  // Verificar si un post tiene like
  const hasLikedPost = (postId: string): boolean => {
    return likes.posts.has(postId);
  };

  // Verificar si un comentario tiene like
  const hasLikedComment = (commentId: string): boolean => {
    return likes.comments.has(commentId);
  };

  // Toggle like en un post
  const togglePostLike = (postId: string): boolean => {
    const newPosts = new Set(likes.posts);
    const wasLiked = newPosts.has(postId);

    if (wasLiked) {
      newPosts.delete(postId);
    } else {
      newPosts.add(postId);
    }

    saveLikes({ ...likes, posts: newPosts });
    return !wasLiked; // Retorna el nuevo estado
  };

  // Toggle like en un comentario
  const toggleCommentLike = (commentId: string): boolean => {
    const newComments = new Set(likes.comments);
    const wasLiked = newComments.has(commentId);

    if (wasLiked) {
      newComments.delete(commentId);
    } else {
      newComments.add(commentId);
    }

    saveLikes({ ...likes, comments: newComments });
    return !wasLiked; // Retorna el nuevo estado
  };

  // Limpiar todos los likes (útil al hacer logout)
  const clearLikes = () => {
    localStorage.removeItem(LIKES_STORAGE_KEY);
    setLikes({ posts: new Set(), comments: new Set() });
  };

  return {
    hasLikedPost,
    hasLikedComment,
    togglePostLike,
    toggleCommentLike,
    clearLikes,
  };
}
