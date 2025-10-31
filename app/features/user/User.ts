/**el tipo final que manejara la app para mostrar su info */
export type User = {
  id: number, 
  gmail: string,
  nombre: string,
  rol: string,
  password?: string | null
}



/**user server response es un tipo para hacer response al servidorespecificamente*/
export interface UserServerResponse extends Request { 
  status: string,
  message: string
}

/**
 * @description
 * user server UserServerResponseObj tener metodos para saber si la peticion fue exitosa
 * ademas de tener la peticion
 * @private usr
 **/
export class UserServerResponseObj {
  private usr: UserServerResponse
  constructor(usr: UserServerResponse) {
    this.usr = usr
  }
  ok(): boolean {
    if(this.usr.status === "ok"){
      return true
    } else return false
  }
}

/**user server request es un tipo para hacer request al servidorespecificamente*/
export interface UserServerRequest extends Request { 
  username: string,
  password: string,
}


export type UserRequest = {
  username: string;
  password: string;
};

export type RegisterUserResponse = {
  status: string;
  message: string;
};

export type UserAppRegister = {
  username: string;
  password: string;
  rol?: string;
};

// Response del login
export type UserResponse = {
  id_usuario: number;
  username: string;
  rol?: string;
  token?: string;
  message?: string;
};
