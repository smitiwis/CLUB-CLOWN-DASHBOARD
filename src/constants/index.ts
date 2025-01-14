// ========== INTERFACES Y TYPES ==========
export type IColors = {
  label: string;
  code: string;
  key: string;
};

export type IOptionSelect = {
  label: string;
  key: string;
  icon?: string;
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
  { label: "Whatsapp", key: "1", icon: "icon-whatsapp" },
  { label: "Boot", key: "2", icon: "icon-robo" },
  { label: "Facebook", key: "3", icon: "icon-facebook-square" },
  { label: "Instagram", key: "4", icon: "icon-instagram" },
  { label: "Tiktok", key: "5", icon: "icon-smile-o" },
  { label: "Referencia", key: "6", icon: "icon-hand-o-right" },
  { label: "Otros", key: "7", icon: "icon-question" },
];

export const COLORES: IColors[] = [
  { label: "No interesados", key: "1", code: "#101010" }, // Gris oscuro para lista negra
  { label: "No responde, deja en visto", key: "6", code: "#FF6F61" }, // Rojo coral vibrante
  { label: "Interesados", key: "2", code: "#FFF700" }, // Amarillo más intenso
  { label: "No hay contacto", key: "3", code: "#FFFFFF" }, // Blanco puro
  { label: "Seguimiento", key: "4", code: "#BF5EFF" }, // Lila vibrante
  { label: "Pago Realizado", key: "5", code: "#69e76f" }, // Verde brillante y llamativo
  { label: "Más adelante, Otras sedes", key: "7", code: "#5DA9FF" }, // Lavanda fuerte y vivo
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
  { key: "2", label: "Llamada cortada" },
  { key: "3", label: "Desinteresado" },
  { key: "4", label: "Interesado" },
  { key: "5", label: "Para otros lugares" },
  { key: "6", label: "Venta" },
  { key: "7", label: "Agendar llamada" },
  { key: "8", label: "Otros" },
];

export const ESTADO_LLAMADA_AGENDA = [
  { key: "1", label: "Pendiente" },
  { key: "2", label: "Atendido" },
  { key: "3", label: "Sin atender" },
];
