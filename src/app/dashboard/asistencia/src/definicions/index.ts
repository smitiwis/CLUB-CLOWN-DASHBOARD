export interface IBAlumnosAsistencia {
  id_cliente: string;
  nombre: string;
  apellido: string;
  asistencias: {
    id_asistencia: string;
    fecha_asistencia: Date;
    estado: string;
  }[];
  deudor: boolean;
  deuda: number;
}
