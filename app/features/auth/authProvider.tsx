import { useState, useContext, type ReactNode, useEffect } from "react";
import type { UserAppRegister, UserRequest, UserResponse } from "./authService";
import { loginService, registerService, fetchMe } from "./authService";
import { AuthContext, type AuthContextType, type AuthUser } from "./authContext";
import { getAuthToken } from "../../server/cookies";
import decodeClaims from "../../utils/authUtil";

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: AuthUser | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Create a mock request object for the client-side
        const mockRequest = {
          headers: new Headers({
            Cookie: document.cookie
          })
        } as unknown as Request;
        
        const token = getAuthToken(mockRequest);
        
        if (token) {
          const result = decodeClaims(token);
          if (result.valid && result.payload.sub) {
            const userId = parseInt(result.payload.sub, 10);
            if (!isNaN(userId)) {
              const userData = await fetchMe(userId);
              if (userData) {
                // Map UserResponse to AuthUser
                const authUser: AuthUser = {
                  ...userData,
                  id: userData.id_usuario,
                  nombre: userData.username // or any other field that represents the name
                };
                setUser(authUser);
              }
            }
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Error al verificar la autenticación');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userCredentials: UserRequest): Promise<AuthUser | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedUser = await loginService(userCredentials);
      // Map UserResponse to AuthUser
      const authUser: AuthUser = {
        ...loggedUser,
        id: loggedUser.id_usuario,
        nombre: loggedUser.username // or any other field that represents the name
      };
      setUser(authUser);
      setIsLoading(false);
      return authUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el inicio de sesión';
      setError(errorMessage);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    // Limpiar el estado local
    setUser(null);
    // Aquí podrías hacer una llamada al endpoint de logout si es necesario
    // await logoutService();
  };

  const register = async (userData: UserAppRegister): Promise<{ status: string; message: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerService(userData);
      setIsLoading(false);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      setError(errorMessage);
      setIsLoading(false);
      throw error;
    }
  };
  /**
   * Verifica si el usuario esta autenticado
   * 
   * @returns true si el usuario esta autenticado, false en caso contrario
   * @throws Error si ocurre un error al verificar la autenticación
   * @example
   * ```
   * const authProvider = new AuthProvider();
   * const isAuthenticated = await authProvider.checkAuth();
   * ```
  */
  const checkAuth = async (): Promise<boolean> => {
    try {
      // Create a mock request object for the client-side
      const mockRequest = {
        headers: new Headers({
          Cookie: document.cookie
        })
      } as unknown as Request;
      
      const token = getAuthToken(mockRequest);
      if (!token) return false;
      
      const result = decodeClaims(token);
      if (!result.valid || !result.payload.sub) return false;
      
      // Verificar con el servidor
      const userId = parseInt(result.payload.sub, 10);
      if (isNaN(userId)) return false;
      
      const userData = await fetchMe(userId);
      if (userData) {
        // Update user state with fresh data
        const authUser: AuthUser = {
          ...userData,
          id: userData.id_usuario,
          nombre: userData.username
        };
        setUser(authUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isLoading,
        error,
        login, 
        logout, 
        register,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
