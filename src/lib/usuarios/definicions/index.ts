export interface IUsuario {
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
  fecha_ingreso: string;
  estado: string;
  correo: string;
}

export interface IUsuarioForm extends IUsuario {
  password: string;
}

export interface IUsuarioRes extends IUsuario {
  id_usuario: string;
}

export interface IUsuarioTable {
  key: string;
  id_usuario: string;
  nombre: string;
  telefono: string;
  dni: string;
  fecha_ingreso: string;
  estado: string;
  correo: string;
}

// ERRORES
export type IStateUsuario = {
  message?: string | null;
  field?: string | null;
  status?: number | null;
} | null;
