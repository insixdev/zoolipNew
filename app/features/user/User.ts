/**el tipo final que manejara la app para mostrar su info */
export type User = {
  id: string;
  email: string;
  username: string;
  role: string;
};
export type UserAppRegister = {
  username: string;
  password: string;
  email?: string;
  role: string;
};

// Response del login el que usara 
// el ssr para manejar 
export class UserResponseHandler {
  user: User;
  status: string;
  message?: string;

  constructor(user: User, status: string, message?: string) {
    this.user = user;
    this.status = status;
    this.message = message;
  }
}

export type UserErrorHandler = {
  succes: boolean;
  status: string;
  message?: string;
};

export function isErrorUser(value: any): value is UserErrorHandler {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.id === "string" &&
    typeof value.name === "string"
  );
}

