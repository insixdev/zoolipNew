import type { ReactNode } from "react";
import type { User } from "../user/User.js";

// Props del provider
interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  const login = async (userCredentials: UserRequest): Promise<UserResponse | null> => {
    try {
      const loggedUser: UserResponse = await loginService(userCredentials);
      setUser(loggedUser.user); // asumiendo que UserResponse tiene la info del usuario
      return loggedUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: UserAppRegister): Promise<RegisterUserResponse> => {
    const response = await registerService(userData);
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
