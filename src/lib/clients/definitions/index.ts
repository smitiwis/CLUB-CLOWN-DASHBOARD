// ====== FRONTEND ======

// "id_cliente": "3c6f82c3-4f15-4ed4-94ac-028114a770d9",
// "id_usuario": "12e8b387-87dd-452f-9724-cb201a255883",
// "telefono": "964912022",
// "nombre_apo": "",
// "nombre": "Luis Angel ",
// "apellido": "peralta",
// "origen": "3",
// "edad": "",
// "grupo": "",
// "estado": "3",
// "fecha_recontacto": null,
// "fecha_creacion": "2025-01-03T07:29:55.372Z"

export type IFClient = {
  telefono: string;
  nombre_apo: string;
  nombre: string;
  apellido: string;
  edad: string;
  grupo: string;
  estado: string;
};

export interface IClientRes extends IFClient {
  id_cliente: string;
}
export interface IClientReq extends IFClient {
  id_cliente: string;
  redirect?: boolean;
}

export interface IFClientTable extends IClientRes {
  key: string;
}

// ================ BACKEND ================
export interface IBClientRes {
  id_cliente: string;
  telefono: string;
  nombre_apo: string;
  nombre: string;
  apellido: string;
  edad: string;
  grupo: string;
  estado: string;
}

// ERRORES
export type IStateCliente = {
  message?: string;
  field?:
    | "telefono"
    | "nombre_apo"
    | "nombre"
    | "apellido"
    | "edad"
    | "grupo"
    | "estado";
  status?: number;
} | null;

export type IStateUpdateClient = {
  message?: string;
  field?:
    | "telefono"
    | "nombre_apo"
    | "nombre"
    | "apellido"
    | "edad"
    | "grupo"
    | "estado";
  client?: IBClientRes;
  status?: number;
} | null;
