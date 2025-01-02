export const GRUPOS = [
  { key: "niño", label: "Niño" },
  { key: "adolescente", label: "Adolescente" },
  { key: "adulto", label: "Adulto" },
];

export const HORARIOS = [
  { key: "mañana", label: "Mañana" },
  { key: "tarde", label: "Tarde" },
  { key: "noche", label: "Noche" },
];

export const LEAD_STATUS = [
  { key: "no inscrito", label: "No inscrito" },
  { key: "interesado", label: "Interesado" },
  { key: "inscrito", label: "Inscrito" },
];

export type IColors = {
  label: string;
  code: string;
  key: string;
};

export const COLORES: IColors[] = [
  { label: "Negro", key: "1", code: "black" },
  { label: "Rojo", key: "2", code: "red" },
  { label: "Blanco", key: "3", code: "white" },
  { label: "Verde", key: "4", code: "green" },
  { label: "Azul", key: "5", code: "blue" },
];

export const STATUS_USER = [
  { key: "1", label: "Activo" },
  { key: "0", label: "Inactivo" },
];

export const STATUS_CLIENT = [{ key: 1, label: "Negro" }];

export const GROUPS_CLIENT = [
  { key: "1", label: "Niño" },
  { key: "2", label: "Adolescente" },
  { key: "3", label: "Adulto" },
];
