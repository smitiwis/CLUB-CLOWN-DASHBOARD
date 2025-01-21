export type IDias = "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";

export interface IFormTaller {
  id_profesor: string;
  nombre: string;
  // dias: string;
  dias: IDias[];
  horaInit: string; // Ejemplo: "9:00 AM "
  horaFin: string; // Ejemplo: "11:00 AM"
  precio: number;
  cant_clases: number;
  estado: "0" | "1"; // "1" para activo, "0" para inactivo
}
