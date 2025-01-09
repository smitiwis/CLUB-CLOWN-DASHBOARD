export type TIPO_CALL = "1" | "2" | "3" | "4";
export type RESULTADO_CALL = "1" | "2" | "3" | "4" | "5" | "6";

export interface IFormClientCall {
  id_cliente: string;
  estado: string;
  observacion: string;
  tipo: TIPO_CALL;
  resultado: RESULTADO_CALL;
  fecha_agendada?: Date | null;
}

export interface IClientCallReq extends IFormClientCall {
  id_cliente_llamada: string;
}

export type IclientOptions = {
  key: string;
  telefono: string;
  id_cliente: string;
  label: string;
  nombre_apo: string;
  nombre: string;
  apellido: string;
  edad: string;
  grupo: string;
  estado: string;
};

// ======== BACKEND ========
export interface IBClientCallRes {
  key: number;
  fecha_creacion: string;
  cliente: {
    id_cliente: string;
    nombre: string;
    telefono: string;
  };
  id_cliente_llamada: string;
  estado: string;
  observacion: string;
  tipo: TIPO_CALL;
  resultado: RESULTADO_CALL;
}

// ERRORES
export type IStateClientCall = {
  message?: string;
  field?: "id_cliente" | "estado" | "observacion" | "tipo" | "resultado";
  status?: number;
} | null;
