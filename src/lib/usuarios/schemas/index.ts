import { REGEX } from "@/constants/regex";
import * as yup from "yup";

const { EMAIL, PHONE_REGEX, DNI_REGEX, PASSWORD_MIN_LENGTH } = REGEX;


export const schemaUsuario = yup.object().shape({
  nombre: yup
    .string()
    .required("Nombre es requerido.")
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(20, "El nombre no puede tener más de 20 caracteres."),

  apellido: yup
    .string()
    .required("Apellido es requerido.")
    .min(3, "El apellido debe tener al menos 3 caracteres.")
    .max(20, "El apellido no puede tener más de 20 caracteres."),

  telefono: yup
    .string()
    .required("Teléfono es requerido.")
    .matches(PHONE_REGEX, "El teléfono debe tener exactamente 9 dígitos."),

  dni: yup
    .string()
    .required("DNI es requerido.")
    .matches(
      DNI_REGEX,
      "El DNI debe contener exactamente 8 dígitos numéricos."
    ),

  fecha_ingreso: yup
    .string()
    .required("Fecha de ingreso es requerida."),

  estado: yup
    .string()
    .required("Estado es requerido.")
    .oneOf(["activo", "inactivo"], "El estado debe ser 'activo' o 'inactivo'."),

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
