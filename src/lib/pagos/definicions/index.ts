import { IPaginationResp } from "@/lib/definitions";

interface Cliente {
  nombre: string;
  apellido: string;
  telefono: string;
}

interface Taller {
  nombre: string;
  dias: string[];
  hora: string;
}

export interface IBPago {
  id_taller_cliente_pago: string;
  img_boucher: string;
  key: number;
  monto: number;
  metodo_pago: string;
  fecha_pago: Date;
  estado_pago: string;
  cliente: Cliente;
  taller: Taller;
}

export interface  IBPagoResp {
  data: IBPago[];
  pagination: IPaginationResp
}