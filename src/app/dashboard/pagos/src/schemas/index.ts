import * as yup from "yup";

export const schemaPago = yup.object().shape({
  id_taller_cliente: yup.string().required("El cliente es obligatorio."),
  monto: yup
    .string()
    .required("El monto es obligatorio.") // Campo requerido
    .matches(/^\d*\.?\d+$/, "El monto debe ser un número positivo."), // Asegura que solo contenga números positivos

  metodo_pago: yup.string().required("El método de pago es obligatorio."),
  baucher: yup.string().required("El baucher es obligatorio."),
  nro_transaccion: yup
    .string()
    .required("El nro de transacción es obligatorio."),
});

export interface IF_pago {
  id_taller_cliente: string;
  monto: string;
  metodo_pago: string;
  baucher: string;
  nro_transaccion: string;
}


export type IStatePago = {
  message?: string;
  field?:
    | "id_taller_cliente"
    | "monto"
    | "metodo_pago"
    | "baucher"
    | "nro_transaccion"
  status?: number;
} | null;
