import * as yup from "yup";

export const schemaClientLlamada = yup.object().shape({
  id_cliente: yup.string().required("El cliente es requerido"),
  estado: yup.string().required("El estado es requerido"),
  observacion: yup.string().required("La observación es requerida"),
  tipo: yup
    .string()
    .oneOf(
      ["1", "2", "3", "4"],
      "El tipo debe ser uno de los valores permitidos: 1, 2, 3, 4, 5"
    )
    .required("El tipo es requerido"),
  resultado: yup
    .string()
    .oneOf(
      ["1", "2", "3", "4", "5", "6"],
      "El tipo debe ser uno de los valores permitidos: 1, 2, 3, 4, 5"
    )
    .required("El tipo es requerido"),
});
