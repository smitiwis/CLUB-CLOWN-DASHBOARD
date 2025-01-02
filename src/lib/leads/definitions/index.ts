// ====== FRONTEND ======
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

export interface IFClientTable extends IClientRes {
  key: string;
}

// ======== BACKEND ========
export interface IBClientRes {
  id_cliente: string;
  telefono: string;
  nombre_apo: string | null;
  nombre: string | null;
  apellido: string | null;
  edad: number | null;
  grupo: number | null;
  estado: number;
  fecha_creacion: Date;
}

// ERRORES
export type IStateLead = {
  message?: string;
  field?: "telefono" | "nombre_apo" | "nombre" | "apellido" | "edad" | "grupo" | "estado";
  status?: number;
} | null;
