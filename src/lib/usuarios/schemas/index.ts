import { REGEX } from "@/constants/regex";
import * as yup from "yup";

const { EMAIL, PASSWORD_MIN_LENGTH } = REGEX;

export const schemaUsuario = yup.object().shape({
  id_rol: yup.string().required("Rol es requerido."),
  tipo_documento: yup
    .string()
    .required("Tipo de documento es requerido.")
    .oneOf(
      ["", "1", "2", "3", "4", "5"],
      "El tipo de documento debe ser '1', '2', '3', '4' o '5'."
    )
    .default(""), // Valor predeterminado "1"

  nro_documento: yup
    .string()
    .required("Número de documento es requerido.")
    .when("tipo_documento", {
      is: (tipo_documento: string) => tipo_documento === "1",
      then: (schema) =>
        schema
          .required("El número de DNI es obligatorio.")
          .matches( REGEX.NUMBER ,"El número de DNI debe ser numerico .")
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
          .matches(REGEX.CE, "El número de CE de ser de 12 dígitos."),
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
      then: (schema) =>
        schema.required("El número de documento es obligatorio."),
    })
    .default(""),

  nombre: yup
    .string()
    .required("Nombre es requerido.")
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(30, "El nombre no puede tener más de 20 caracteres."),

  apellido: yup
    .string()
    .required("Apellido es requerido.")
    .min(3, "El apellido debe tener al menos 3 caracteres.")
    .max(40, "El apellido no puede tener más de 20 caracteres."),

  telefono: yup
    .string()
    .required("Teléfono es requerido.")
    .matches(/^9/, "El teléfono debe comenzar con 9.")
    .matches(/^\d{9}$/, "El teléfono debe tener exactamente 9 dígitos."),

  direccion: yup.string().default(""),
  nro_direccion: yup.string().default(""),

  fecha_ingreso: yup.string().required("Fecha de ingreso es requerida."),

  estado: yup
    .string()
    .required("Estado es requerido.")
    .default("1")
    .oneOf(["1", "0"], "El estado debe ser 'Activo' o 'Inactivo'."),

  correo: yup
    .string()
    .required("Correo es requerido.")
    .matches(EMAIL, "Correo es inválido.")
    .email("Correo debe ser un email válido."),

  password: yup
    .string()
    .required("Contraseña es requerida.")
    .min(
      PASSWORD_MIN_LENGTH,
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
    )
    .max(100, "La contraseña no puede exceder 100 caracteres."),
});


export const schemaUsuarioEdit = yup.object().shape({
  id_rol: yup.string().required("Rol es requerido."),
  tipo_documento: yup
    .string()
    .required("Tipo de documento es requerido.")
    .oneOf(
      ["", "1", "2", "3", "4", "5"],
      "El tipo de documento debe ser '1', '2', '3', '4' o '5'."
    )
    .default(""), // Valor predeterminado "1"

  nro_documento: yup
    .string()
    .required("Número de documento es requerido.")
    .when("tipo_documento", {
      is: (tipo_documento: string) => tipo_documento === "1",
      then: (schema) =>
        schema
          .required("El número de DNI es obligatorio.")
          .matches( REGEX.NUMBER ,"El número de DNI debe ser numerico .")
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
          .matches(REGEX.CE, "El número de CE de ser de 12 dígitos."),
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
      then: (schema) =>
        schema.required("El número de documento es obligatorio."),
    })
    .default(""),

  nombre: yup
    .string()
    .required("Nombre es requerido.")
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(25, "El nombre no puede tener más de 20 caracteres."),

  apellido: yup
    .string()
    .required("Apellido es requerido.")
    .min(3, "El apellido debe tener al menos 3 caracteres.")
    .max(35, "El apellido no puede tener más de 20 caracteres."),

  telefono: yup
    .string()
    .required("Teléfono es requerido.")
    .matches(/^9/, "El teléfono debe comenzar con 9.")
    .matches(/^\d{9}$/, "El teléfono debe tener exactamente 9 dígitos."),

  direccion: yup.string().default(""),
  nro_direccion: yup.string().default(""),

  fecha_ingreso: yup.string().required("Fecha de ingreso es requerida."),

  estado: yup
    .string()
    .required("Estado es requerido.")
    .default("1")
    .oneOf(["1", "0"], "El estado debe ser 'Activo' o 'Inactivo'."),

  correo: yup
    .string()
    .required("Correo es requerido.")
    .matches(EMAIL, "Correo es inválido.")
    .email("Correo debe ser un email válido."),

  password: yup
    .string()
    .max(40, "La contraseña no puede exceder 40 caracteres.")
    .default(""),
});
