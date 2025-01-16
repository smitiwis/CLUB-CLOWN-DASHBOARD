import { REGEX } from "@/constants/regex";
import * as yup from "yup";


export const schemaClient = yup.object().shape({
  telefono: yup
    .string()
    .required("El teléfono es obligatorio.")
    .matches(/^\d{9}$/, "El teléfono debe tener 9 dígitos."),

  tipo_documento: yup
    .string()
    .oneOf(
      ["", "1", "2", "3", "4", "5"],
      "El tipo de documento debe ser '1', '2', '3', '4' o '5'."
    )
    .default(""), // Valor predeterminado "1"

  nro_documento: yup
    .string()
    .when("tipo_documento", {
      is: (tipo_documento: string) => tipo_documento === "1",
      then: (schema) =>
        schema
          .required("El número de DNI es obligatorio.")
          .matches(REGEX.DNI, "El número de DNI debe ser de 8 dígitos."),
    })
    .when("tipo_documento", {
      is: (tipo_documento: string) => tipo_documento === "2",
      then: (schema) =>
        schema
          .required("El número de RUC es obligatorio.")
          .matches(REGEX.RUC, "El número de RUC debe ser de 11 dígitos."),
    })
    .when("tipo_documento", {
      is: (tipo_documento: string) => tipo_documento === "3",
      then: (schema) =>
        schema
          .required("El número de CE es obligatorio.")
          .matches(REGEX.CE, "El número de CE debe ser válido."),
    })
    .when("tipo_documento", {
      is: (tipo_documento: string) => tipo_documento === "4",
      then: (schema) =>
        schema
          .required("El número de PASS es obligatorio.")
          .matches(REGEX.PASS, "El número de PASS debe ser de 11 dígitos."),
    })
    .when("tipo_documento", {
      is: (tipo_documento: string) => tipo_documento === "5",
      then: (schema) => schema.required("El número es obligatorio."),
    })
    .default(""),

  nombre_apo: yup.string().default(""), // Valor predeterminado vacío
  nombre: yup.string().default(""),
  apellido: yup.string().default(""),
  edad: yup.string().default(""), // Permite vacío pero no undefined
  direccion: yup.string().default(""),
  nro_direccion: yup.string().default(""),
  origen: yup
    .string()
    .required("El origen es obligatorio.")
    .oneOf(
      ["1", "2", "3", "4", "5", "6", "7"],
      "El origen debe ser uno de los valores permitidos: 1, 2, 3, 4, 5, 6 o 7"
    )
    .default("3"), // Valor predeterminado "3"
  grupo: yup
    .string()
    .oneOf(["", "1", "2", "3"], "El grupo debe ser '1', '2' o '3'.")
    .default(""),

  estado: yup.string().default(""),

  fecha_agendada: yup
    .date()
    .optional()
    .when("resultado", (resultado, schema) => {
      if (resultado[0] === "5") {
        return schema
          .min(new Date(), "La fecha debe ser mayor a la fecha actual")
          .required("La fecha de recontacto es requerida");
      }
      return schema;
    }),
});
