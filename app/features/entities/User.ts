/**el tipo final que manejara la app para mostrar su info */
export type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  biografia: string | null;
  imagen_url: string | null;
};



export type UserErrorResponse = {
  status: string;
  message: string;
  error: string;
}

/**user server response es un tipo para hacer response al servidorespecificamente*/
export interface UserServerResponse extends Request {
  status: string;
  message: string;
}

/**
 * @description
 * user server UserServerResponseObj tener metodos para saber si la peticion fue exitosa
 * ademas de tener la peticion
 * @private usr
 **/
export class UserServerResponseObj {
  private usr: UserServerResponse;
  constructor(usr: UserServerResponse) {
    this.usr = usr;
  }
  ok(): boolean {
    if (this.usr.status === "succes") {
      return true;
    } else return false;
  }
}

/**user server request es un tipo para hacer request al servidorespecificamente*/
export interface UserServerRequest extends Request {
  username: string;
  password: string;
}

export type UserRequest = {
  username: string;
  password: string;
};

export type UserResponse= {
  status: string;
  message: string;
};
// userRequest para register
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

