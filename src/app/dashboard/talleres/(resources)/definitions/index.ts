export type IDias =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

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

export interface IFInscripcion {
  apellido: string;
  edad: string;
  estado_pago: string;
  id_cliente: string;
  key: number;
  nombre: string;
  pagoTotal: number;
  telefono: string;
  precio_venta: number;
  fecha_inscripcion: Date;
  usuario: {
    nombre: string;
    apellido: string;
    correo: string;
    id_usuario: string;
  };
}
export interface IRespInscritos {
  inscritos: IFInscripcion[];
}
