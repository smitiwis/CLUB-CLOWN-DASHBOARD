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
  { label: "Gris", key: "gris", code: "#696969" },
  { label: "Rojo", key: "rojo", code: "#ff0000" },
  { label: "Verde", key: "verde", code: "#00ff00" },
  { label: "Azul", key: "azul", code: "#0000ff" },
  { label: "Amarillo", key: "amarillo", code: "#ffff00" },
  { label: "Negro", key: "negro", code: "#000000" },
  { label: "Blanco", key: "blanco", code: "#ffffff" },
];