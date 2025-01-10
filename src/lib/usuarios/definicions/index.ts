export interface IUsuarioForm  {
  id_rol: string;
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  fecha_ingreso: string;
  estado: string;
  correo: string;
  password: string;
}

export interface IUsuario {
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  fecha_ingreso: string;
  estado: string;
  correo: string;
  rol: {id_rol: string, nombre: string};
}

export interface IUsuarioRes extends IUsuario {
  id_usuario: string;
}

export interface IUsuarioReq extends IUsuarioForm {
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

export type IStateDeleteUser = {
  message?: string;
  status?: number;
} | null;