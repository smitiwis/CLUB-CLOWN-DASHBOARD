import { TTypeDocumento } from "@/lib/clients/definitions";

export interface IUsuarioForm {
  id_rol: string;
  tipo_documento: TTypeDocumento; // Por defecto es "" (cadena vacía)
  nro_documento: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_ingreso: string;
  direccion: string; // Dirección
  nro_direccion: string; // Número de dirección
  estado: string;
  correo: string;
  password: string;
}

export interface IUsuario {
  tipo_documento: TTypeDocumento; // Por defecto es "" (cadena vacía)
  nro_documento: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_ingreso: string;
  direccion: string; // Dirección
  nro_direccion: string; // Número de dirección
  estado: string;
  correo: string;
}

export interface IUsuarioRes  {
  tipo_documento: TTypeDocumento; // Por defecto es "" (cadena vacía)
  nro_documento: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fecha_ingreso: string;
  direccion: string; // Dirección
  nro_direccion: string; // Número de dirección
  estado: string;
  correo: string;
  rol: {
    id_rol: string;
    nombre: string;
  }
  id_usuario: string;
}

export interface IUsuarioByIdRes extends IUsuario {
  id_usuario: string;
  rol: {
    id_rol: string;
    nombre: string;
  }
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
  field?:
    | "nombre"
    | "apellido"
    | "telefono"
    | "fecha_ingreso"
    | "estado"
    | "correo"
    | "password";
  status?: number;
} | null;

export type IStateDeleteUser = {
  message?: string;
  status?: number;
} | null;
