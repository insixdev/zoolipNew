import { createContext } from "react";
import { RegisterUserResponse, UserAppRegister, UserRequest } from "./authService";
import { User } from "../../../../server/types/User";
import { UserResponse } from "../users";

/**
 * contrato de que datos
 * funciones estaran en toda la applicacion
 * */

// 2. Crear el contexto


interface AuthContextType {
  user: User | null;
  logout: () => void;
  login: (user: UserRequest) => Promise<UserResponse | null>;
  register: (user: UserAppRegister) => Promise<RegisterUserResponse>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
