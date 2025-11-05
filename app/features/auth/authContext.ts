import { createContext } from "react";
import { User } from "../user/User";

export interface AuthError {
  message: string;
  status: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  authError: AuthError | null;
  setAuthError: (error: AuthError | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
