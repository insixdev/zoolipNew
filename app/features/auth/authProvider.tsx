import { useState } from "react";
import { AuthContext, AuthError } from "./authContext";

import { User } from "../entities/User";

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
  initialError?: AuthError | null;
}

export function AuthProvider({
  children,
  initialUser,
  initialError = null,
}: AuthProviderProps) {

  // estado de autenticación en memoria - evita requests innecesarias al backend
  // Solo se actualiza en login/logout o recarga de página
  const [user, setUser] = useState<User | null>(initialUser);
  const [authError, setAuthError] = useState<AuthError | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);

  // función mejorada para actualizar usuario
  const updateUser = (newUser: User | null) => {
    console.log(
      "AuthProvider: Actualizando usuario",
      newUser ? newUser.username : "null"
    );
    setUser(newUser);
    setAuthError(null); // Limpiar errores al actualizar usuario
  };

  // Función para manejar logout temporal
  const logout = () => {
    console.log(" AuthProvider: Logout ejecutado");
    setUser(null);
    setAuthError(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        authError,
        setAuthError,
        isLoading,
        setIsLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
