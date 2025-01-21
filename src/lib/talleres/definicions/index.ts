import { IDias } from "@/app/dashboard/talleres/definitions";

export type IStateTaller = {
  message?: string;
  field?:
    | "id_profesor"
    | "nombre"
    | "dias"
    | "hora"
    | "precio"
    | "cant_clases"
    | "estado";
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
