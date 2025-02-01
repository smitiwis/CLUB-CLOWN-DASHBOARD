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


interface IFPago {
  monto: number;
  fecha_pago: Date;
}

interface IFCliente {
  id_cliente: string;
  nombre: string;
  apellido: string;
  telefono: string;
  edad: string;
}

export interface IFInscripcion {
  key: number;
  pagoTotal: number;
  estado_pago: string;
  cliente: IFCliente;
  taller_cliente_pagos: IFPago[];
  precio_venta: number;
  fecha_inscripcion: Date;
}
export interface IRespInscritos {
  inscritos: IFInscripcion[];
}