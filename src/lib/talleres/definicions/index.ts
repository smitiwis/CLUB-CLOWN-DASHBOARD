import { IDias } from "@/app/dashboard/talleres/(resources)/definitions";

export type IStateTaller = {
  message?: string;
  field?: IDias;
  status?: number;
} | null;

export interface IBFormTaller {
  id_profesor: string;
  nombre: string;
  dias: IDias[];
  hora: string; // Ejemplo: "9:00 AM - 11:00 AM"
  precio: number;
  cant_clases: number;
  estado: "0" | "1"; // "1" para activo, "0" para inactivo
}

export interface IBTallerResp {
  id_taller: string;
  key: number;
  nombre: string;
  dias: IDias[];
  hora: string;
  precio: number;
  cant_clases: number;
  estado: string;
  profesor: {
    id_profesor: string;
    nombre: string;
    apellidos: string;
  };
  inscritos: number;
}

export interface IBTallerDataResp {
  data: IBTallerResp[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export interface IBTalleresOptions {
  nombre: string;
  profesor: {
    nombre: string;
    id_profesor: string;
    apellidos: string;
  };
  id_taller: string;
  dias: IDias[];
  hora: string;
  precio: number;
  cant_clases: number;
}
