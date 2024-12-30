export interface IUsuario {
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  fecha_ingreso: string;
  estado: number;
  correo: string;
}

export interface IUsuarioForm extends IUsuario {
  password: string;
}

export interface IUsuarioRes extends IUsuario {
  id_usuario: string;
}

export interface IUsuarioReq extends IUsuario {
  id_usuario: string;
}

export interface IUsuarioTable extends IUsuarioRes {
  key: string;
}

// ERRORES
export type IStateUsuario = {
  message?: string;
  field?: "nombre" | "apellido" | "telefono" | "dni" | "fecha_ingreso" | "estado" | "correo" | "password";
  status?: number;
} | null;
