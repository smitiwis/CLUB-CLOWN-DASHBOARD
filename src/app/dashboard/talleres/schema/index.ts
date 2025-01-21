import * as Yup from "yup";
const diasValidos = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

export const formTallerSchema = Yup.object().shape({
  id_profesor: Yup.string().required("Debes escoger un profesor"),

  nombre: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres")
    .required("El nombre es obligatorio"),

  // dias: Yup.string()
  //   .min(1, "Debe seleccionar al menos un día")
  //   .required("Los días son obligatorios"),

  dias: Yup.array()
  .of(
    Yup.string()
      .oneOf(diasValidos, "El día debe ser válido") // Restringe los valores a los días válidos
      .required("Cada día es obligatorio")
  )
  .min(1, "Debe seleccionar al menos un día")
  .required("El campo días es obligatorio"),

  horaInit: Yup.string().required("La hora inicial es obligatoria"),

  horaFin: Yup.string().required("La hora final es obligatoria"),

  precio: Yup.number()
    .positive("El precio debe ser un número positivo")
    .required("El precio es obligatorio"),

  cant_clases: Yup.number()
    .min(1, "Debe haber al menos una clase")
    .required("La cantidad de clases es obligatoria"),

  estado: Yup.string()
    .oneOf(["0", "1"], "Estado inválido, solo puede ser 'Activo' o 'Inactivo'")
    .required("El estado es obligatorio"),
});
