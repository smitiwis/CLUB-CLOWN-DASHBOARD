import { REGEX } from "@/constants/regex";
import * as yup from "yup";

export const schemaInscripcion = yup.object().shape({
  id_cliente: yup.string().required("El cliente es obligatorio."),
  id_taller: yup.string().required("El taller es obligatorio."),
  id_taller_promocion: yup.string(),
  precio_venta: yup.string().required("El precio de venta es obligatorio."),
  monto: yup.string().nullable(), // Permite que sea opcional

  metodo_pago: yup.string().when("monto", {
    is: (monto: number) => monto >= 25,
    then: (schema) => schema.required("El método de pago es obligatorio."),
  }),
  baucher: yup.string().when("monto", {
    is: (monto: number) => monto >= 25,
    then: (schema) => schema.required("El baucher es obligatorio."),
  }),
  estado_inscripcion: yup
    .string()
    .required("El estado de la inscripción es obligatorio."),
  nro_transaccion: yup
    .string()
    .when("monto", {
      is: (monto: number) => monto >= 25,
      then: (schema) =>
        schema
          .required("El nro de transacción es obligatorio.")
          .matches(
            REGEX.NO_CHARACTERS_SPECIAL,
            "El numero de transaccion debe ser alfanumerico"
          ),
    }),
});

export interface IF_Inscripcion {
  id_cliente: string;
  id_taller: string;
  id_taller_promocion?: string;
  precio_venta: string;
  monto?: string | null;
  metodo_pago?: string;
  baucher?: string;
  nro_transaccion?: string;
  estado_inscripcion: string;
}

export interface IF_InscripcionReq {
  id_cliente: string;
  id_taller: string;
  id_taller_promocion: string;
  precio_venta: string;
  pago: {
    monto: string;
    metodo_pago: string;
    baucher: string;
    nro_transaccion: string;
    estado: string;
  } | null;
}

// ERRORES
export type IStateInscription = {
  message?: string;
  field?:
    | "id_cliente"
    | "id_taller"
    | "id_taller_promocion"
    | "precio_venta"
    | "monto"
    | "baucher"
    | "nro_transaccion"
    | "estado_inscripcion";
  status?: number;
} | null;
