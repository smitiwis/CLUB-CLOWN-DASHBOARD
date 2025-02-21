import * as yup from "yup";

export const schemaEditInscripcion = yup.object().shape({
  id_inscripcion: yup.string().required("La inscripción es obligatoria."),
  id_cliente: yup.string().required("El cliente es obligatorio."),
  id_usuario: yup.string().required("El usuario es obligatorio."),
  id_taller: yup.string().required("El taller es obligatorio."),
  id_taller_promocion: yup.string().required("La promoción es obligatoria."),
  estado: yup.string().required("El estado es obligatorio."),
  precio_venta: yup.string().required("El precio de venta es obligatorio."),
  observacion: yup.string(),
});



export type IF_EditInscripcionReq = {
  id_inscripcion: string;
  id_cliente: string;
  id_usuario: string;
  id_taller: string;
  id_taller_promocion: string;
  estado: string;
  precio_venta: string;
  observacion?: string;
}

export type IStateEditInscription = {
  message?: string;
  field?:
    | "id_inscripcion"
    | "id_cliente"
    | "id_usuario"
    | "id_taller"
    | "id_taller_promocion"
    | "estado"
    | "precio_venta"
    | "observacion"
  status?: number;
} | null;
