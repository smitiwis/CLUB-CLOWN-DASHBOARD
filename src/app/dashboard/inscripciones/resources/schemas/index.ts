import * as yup from "yup";

export const schemaInscripcion = yup.object().shape({
  id_cliente: yup.string().required("El cliente es obligatorio."),
  id_taller: yup.string().required("El taller es obligatorio."),
  id_taller_promocion: yup.string(),
  precio_venta: yup.string().required("El precio de venta es obligatorio."),
  monto: yup
  .string()
  .nullable() // Permite que sea opcional
  .transform((value) => (value === "" ? null : value)) // Transforma un string vacío en null
  .matches(/^\d*\.?\d+$/, "El monto debe ser un número positivo.") // Asegura que solo contenga números positivos
  .test("min-value", "El monto no puede ser menor a 25.", (value) => {
    if (value === null) return true; // Si es null, pasa la validación
    return parseFloat(value || "0") >= 25; // Convierte el string en número y verifica que no sea menor a 25
  }),
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
});

export interface IF_Inscripcion {
  id_cliente: string;
  id_taller: string;
  id_taller_promocion?: string;
  precio_venta: string;
  monto?: string | null;
  metodo_pago?: string;
  baucher?: string;
  estado_inscripcion: string;
}
