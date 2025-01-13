// ========== INTERFACES Y TYPES ==========
export type IColors = {
  label: string;
  code: string;
  key: string;
};

export type IOptionSelect = {
  label: string;
  key: string;
};


// =========== CONSTANTES ===========
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

export const DOCUMENTS: IOptionSelect[] = [
  { label: "DNI", key: "1" },
  { label: "RUC", key: "2" },
];

export const ORIGENES_CLIENTS = [
  { label: "Whatsapp", key: "1" },
  { label: "Boot", key: "2" },
  { label: "Facebook", key: "3" },
  { label: "Instagram", key: "4" },
  { label: "Tiktok", key: "5" },
  { label: "Referencia", key: "6" },
  { label: "Otros", key: "7" },
];

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

export const TIPO_LLAMADAS = [
  { key: "1", label: "Entrante" },
  { key: "2", label: "Saliente" },
  { key: "3", label: "Seguimiento" },
  { key: "4", label: "otros" },
];

export const RESULTADO_LLAMADAS = [
  { key: "1", label: "No contesta" },
  { key: "2", label: "No interesado" },
  { key: "3", label: "Interesado" },
  { key: "4", label: "Venta" },
  { key: "5", label: "Volber a llamar" },
  { key: "6", label: "Otros" },
];

export const RESULTADO_LLAMADA_AGENDA = [
  {key: "1", label: "Atendida"},
  {key: "2", label: "Atendida fuera de tiempo"},
  {key: "3", label: "No atendida"},
]