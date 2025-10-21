import { createContext } from "react";
import type { User } from "../user/User.js";
import type { RegisterUserResponse, UserAppRegister, UserRequest, UserResponse } from "./authService.js";

/**
 * contrato de que datos
 * funciones estaran en toda la applicacion
 * */

// 2. Crear el contexto


export interface AuthContextType {
  user: User | null;
  logout: () => void;
  login: (user: UserRequest) => Promise<UserResponse | null>;
  register: (user: UserAppRegister) => Promise<RegisterUserResponse>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
