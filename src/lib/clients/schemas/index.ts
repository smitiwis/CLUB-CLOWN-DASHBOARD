import * as yup from "yup";

export const schemaClient = yup.object().shape({
  telefono: yup
    .string()
    .required("El teléfono es obligatorio.")
    .matches(/^\d{9}$/, "El teléfono debe tener 9 dígitos."),
  nombre_apo: yup.string().default(""), // Valor predeterminado vacío
  nombre: yup.string().default(""),
  apellido: yup.string().default(""),
  edad: yup.string().default(""), // Permite vacío pero no undefined
  grupo: yup.string().default(""),
  estado: yup.string().default(""),
  fecha_recontacto: yup
    .date()
    .nullable()
    .typeError("La fecha debe ser válida")
    .min(new Date(), "La fecha de recontacto no puede ser en el pasado"),
});
