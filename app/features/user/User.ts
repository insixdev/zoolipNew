/**el tipo final que manejara la app para mostrar su info */
export type User = {
  id: number, 
  nombre: string,
  rol: string,
  password?: string | null
}

/**user server request es un tipo para hacer request al servidorespecificamente*/
export interface UserServerRequest extends Request { 
  username: string,
  password: string,
}
