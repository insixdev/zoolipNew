import { createContext, useContext } from "react";
import type { UserAppRegister, UserRequest, UserResponse } from "./authService";

export type AuthUser = UserResponse & {
  id: number;
  nombre: string;
};

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: UserRequest) => Promise<AuthUser | null>;
  logout: () => void;
  register: (userData: UserAppRegister) => Promise<{ status: string; message: string }>;
  checkAuth: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
