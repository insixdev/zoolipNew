import { useState, type ReactNode, useEffect, useCallback } from "react";
import { loginService, registerService, fetchMe } from "./authService";
import { AuthContext, type AuthContextType } from "./authContext";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  [key: string]: any;
}
import { getAuthToken } from "../../server/cookies";
import { decodeClaims } from "../../lib/authUtil";
import type { UserAppRegister, UserRequest } from "../user/User";

interface AuthProviderProps {
  children: ReactNode;
  user?: AuthUser | null;
  initialUser?: AuthUser | null;
}

export function AuthProvider({ children, user: propUser, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(propUser || initialUser);
  
  // Keep internal state in sync with prop
  useEffect(() => {
    if (propUser !== undefined) {
      setUser(propUser);
    }
  }, [propUser]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async (): Promise<boolean> => {
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
        try {
          const result = await decodeClaims(token);
          if (result.valid && result.payload.sub) {
            const userId = parseInt(result.payload.sub, 10);
            if (!isNaN(userId)) {
              const userData = await fetchMe();
              if (userData) {
                // Map UserResponse to AuthUser
                const authUser: AuthUser = {
                  ...userData,
                  id: userData.id_usuario,
                  nombre: userData.username || ''
                };
                setUser(authUser);
                return true;
              }
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          // If there's an error, treat it as an invalid token
          setUser(null);
          return false;
        }
      }
      setUser(null);
      return false;
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Error al verificar la autenticación');
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authentication on mount
  // Initialize auth state on mount
  useEffect(() => {
    checkAuth().catch(error => {
      console.error('Authentication check failed:', error);
      setError('Failed to check authentication status');
    });
  }, [checkAuth]);

  const login = async (userCredentials: UserRequest): Promise<AuthUser | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedUser = await loginService(userCredentials);
      // Map UserResponse to AuthUser
      const authUser: AuthUser = {
        ...loggedUser,
        id: loggedUser.id_usuario,
        nombre: loggedUser.username || ''
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

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    register,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
