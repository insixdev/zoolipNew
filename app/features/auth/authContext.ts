import { createContext } from "react";

export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
