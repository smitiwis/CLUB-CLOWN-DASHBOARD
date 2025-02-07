// ====== FRONTEND ======
export type TTypeDocumento = "" | "1" | "2" | "3" | "4" | "5";
export type TOrigen = "1" | "2" | "3" | "4" | "5" | "6" | "7";
export type IGrupo_Client = "" | "1" | "2" | "3";
export type IEstado_agenda = "" | "1" | "2";
export type ICategoria = "1" | "2" | "3";

export type IFClient = {
  telefono: string;
  tipo_documento: TTypeDocumento; // Por defecto es "" (cadena vacía)
  nro_documento: string;
  nombre_apo: string;

  nombre: string;
  apellido: string;
  edad: string;
  direccion: string; // Dirección
  nro_direccion: string; // Número de dirección
  origen: TOrigen; // Valor predeterminado "3"
  grupo: IGrupo_Client;
  categoria: ICategoria;
  estado: string;

  fecha_agendada?: Date | null | undefined; // Opcional o null
};

export interface IGruposClients {
  min: number;
  max: number;
  grupo: IGrupo_Client;
}

export interface IClientRes extends IFClient {
  id_cliente: string;
}
export interface IClientReq extends IFClient {
  id_cliente: string;
  redirect?: boolean;
}

export interface IRowClientTable {
  telefono: string;
  tipo_documento: TTypeDocumento;
  nro_documento: string;
  nombre_apo: string;

  nombre: string;
  apellido: string;
  edad: string;
  direccion: string;
  nro_direccion: string;
  origen: TOrigen;
  grupo: IGrupo_Client;
  estado: string;
  nro_llamadas: number;

  estadoAgenda: string;
  fechaAgendada: string | null;

  key: string;
  id_cliente: string;
}

// ================ BACKEND ================
export interface IBClientsResp {
  data: IBClients[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
export interface IBClientOptions {
  nombre: string;
  apellido: string;
  telefono: string;
  id_cliente: string;
  origen: string;
}
export interface IBClients {
  id_cliente: string;
  telefono: string;
  nombre_apo: string;
  nombre: string;
  apellido: string;
  edad: string;
  grupo: IGrupo_Client;
  categoria: ICategoria;
  estado: string;

  tipo_documento: TTypeDocumento;
  nro_documento: string;
  direccion: string;
  nro_direccion: string;
  origen: TOrigen;

  llamada: {
    id_cliente_llamada: string;
    fecha_agendada: Date | null;
    estado_agenda: string;
  } | null;

  nro_llamadas: number;
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
  client?: IBClients;
  status?: number;
} | null;
