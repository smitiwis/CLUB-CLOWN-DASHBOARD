import { IPaginationResp } from "@/lib/definitions";

export interface IBInscripcionOption {
  id_cliente: string;
  nombre: string;
  apellido: string;
  telefono: string;
  taller: string;
  totalPagado: number;
  saldoPendiente: number;
}

// INSCRIPCIONES DEFINITIONS
interface Profesor {
  nombre: string;
  apellidos: string;
  telefono: string | null;
}

interface Taller {
  nombre: string;
  clases: number;
  horario: string;
  telefono: string | null;
  dias: string[];
  precio: number;
  profesor: Profesor;
}

interface Promocion {
  id: string;
  nombre: string;
  descuento: number;
}

export interface Pago {
  id: string;
  monto: number;
  metodo: string;
  fecha: Date;
  imgBoucher: string;
  nroTransaccion: string;
}

export interface IBInscripcion {
  id: string;
  key: number;
  nombre: string;
  telefono: string;
  estadoPago: string;
  precioVenta: number;
  observacion: string;
  estado: string;

  taller: Taller;
  promocion: Promocion | null;
  pagos: Pago[];
  asesorRegistro: {
    id: string;
    nombre: string;
  };
  asesorInscripcion: {
    id: string;
    nombre: string;
  };
}

export interface IBInscripcionResponse {
  data: IBInscripcion[];
  pagination: IPaginationResp;
}


export interface IUploadResult {
  secure_url: string;
  public_id: string;
  url: string;
}