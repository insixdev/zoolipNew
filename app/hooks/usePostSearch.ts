// Hook para busqueda de posts y usuarios en tiempo real con WebSocket
import { useState, useEffect, useRef, useCallback } from "react";

type SearchPost = {
  id_publicacion?: number;
  idPublicacion?: number;
  topico: string;
  contenido: string;
  nombreUsuario: string;
  likes: number;
  fecha_pregunta?: string;
  fechaPregunta?: string;
  fecha_edicion?: string;
  fechaEdicion?: string;
  fecha_duda_resuelta?: string;
  fechaDudaResuelta?: string;
};

type SearchUser = {
  id?: number;
  id_usuario?: number;
  username: string;
  nombre?: string;
  email: string;
  role?: string;
  rol?: string;
};

export function usePostSearch() {
  const [postResults, setPostResults] = useState<SearchPost[]>([]);
  const [userResults, setUserResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      const ws = new WebSocket(`ws://localhost:3050/post/search`);

      ws.onopen = () => {
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            setError(data.error);
            setIsSearching(false);
            return;
          }

          if (data.posts !== undefined && data.users !== undefined) {
            setPostResults(Array.isArray(data.posts) ? data.posts : []);
            setUserResults(Array.isArray(data.users) ? data.users : []);
          } else if (Array.isArray(data)) {
            setPostResults(data);
            setUserResults([]);
          } else {
            setPostResults([]);
            setUserResults([]);
          }

          setIsSearching(false);
        } catch (err) {
          setError("Error al procesar resultados");
          setIsSearching(false);
        }
      };

      ws.onerror = () => {
        setError("Error de conexion");
        setIsSearching(false);
      };

      ws.onclose = (event) => {
        wsRef.current = null;
        setIsSearching(false);

        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      setError("Error al conectar");
    }
  }, []);

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setPostResults([]);
      setUserResults([]);
      setIsSearching(false);
      return;
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("No conectado al servidor");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      wsRef.current.send(query);
    } catch (err) {
      setError("Error al enviar busqueda");
      setIsSearching(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      connect();
    }, 100);

    return () => {
      clearTimeout(timer);
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    postResults,
    userResults,
    isSearching,
    error,
    search,
    isConnected:
      typeof window !== "undefined" &&
      wsRef.current?.readyState === WebSocket.OPEN,
  };
}
