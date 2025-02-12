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
  { label: "CE", key: "3" },
  { label: "PASS", key: "4" },
  { label: "Otro", key: "5" },
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
  { label: "No responde, deja en visto", key: "2", code: "#FF6F61" }, // Rojo coral vibrante
  { label: "Interesados", key: "3", code: "#FFF700" }, // Amarillo más intenso
  { label: "No hay contacto", key: "4", code: "#FFFFFF" }, // Blanco puro
  { label: "Seguimiento", key: "5", code: "#BF5EFF" }, // Lila vibrante
  { label: "Pago Realizado", key: "6", code: "#69e76f" }, // Verde brillante y llamativo
  { label: "Inscrito sin pago", key: "7", code: "#00605c" }, // Azul fuerte y vivo
  { label: "Más adelante, Otras sedes", key: "8", code: "#5DA9FF" }, // Lavanda fuerte y vivo
];

export const STATUS_USER = [
  { key: "1", label: "Activo" },
  { key: "0", label: "Inactivo" },
];

export const STATUS_MAIN = [
  { key: "1", label: "Activo" },
  { key: "0", label: "Inactivo" },
];

export const STATUS_CLIENT = [{ key: 1, label: "Negro" }];

export const GROUPS_CLIENT = [
  { key: "1", label: "Niño" },
  { key: "2", label: "Adolescente" },
  { key: "3", label: "Adulto" },
];
export const CATEGORIA_CLIENT = [
  { key: "1", label: "Clown Regular" },
  { key: "2", label: "Clown Para Parejas" },
  { key: "3", label: "Clown Full Day" },
];

export const TIPO_LLAMADAS = [
  { key: "1", label: "Entrante" },
  { key: "2", label: "Saliente" },
  { key: "3", label: "Seguimiento" },
  { key: "4", label: "otros" },
];

export const RESULTADO_LLAMADAS = [
  { key: "7", label: "Agendar llamada" },
  { key: "1", label: "No contesta" },
  { key: "2", label: "Llamada cortada" },
  { key: "3", label: "Desinteresado" },
  { key: "4", label: "Interesado" },
  { key: "5", label: "Para otros lugares" },
  { key: "6", label: "Venta" },
  { key: "8", label: "Otros" },
];

export const ESTADO_LLAMADA_AGENDA = [
  { key: "1", label: "Pendiente" },
  { key: "2", label: "Atendido" },
  { key: "3", label: "Sin atender" },
];

export const DIAS_TALLERES = [
  { key: "Lunes", label: "Lunes" },
  { key: "Martes", label: "Martes" },
  { key: "Miércoles", label: "Miercoles" },
  { key: "Jueves", label: "Jueves" },
  { key: "Viernes", label: "Viernes" },
  { key: "Sábado", label: "Sabado" },
  { key: "Domingo", label: "Domingo" },
];

export const HORAS_CLASES = [
  { id: 1, key: "08:00 AM", label: "08:00 AM" },
  { id: 2, key: "08:30 AM", label: "08:30 AM" },
  { id: 3, key: "09:00 AM", label: "09:00 AM" },
  { id: 4, key: "09:30 AM", label: "09:30 AM" },
  { id: 5, key: "10:00 AM", label: "10:00 AM" },
  { id: 6, key: "10:30 AM", label: "10:30 AM" },
  { id: 7, key: "11:00 AM", label: "11:00 AM" },
  { id: 8, key: "11:30 AM", label: "11:30 AM" },
  { id: 9, key: "12:00 PM", label: "12:00 PM" },
  { id: 10, key: "12:30 PM", label: "12:30 PM" },
  { id: 11, key: "01:00 PM", label: "01:00 PM" },
  { id: 12, key: "01:30 PM", label: "01:30 PM" },
  { id: 13, key: "02:00 PM", label: "02:00 PM" },
  { id: 14, key: "02:30 PM", label: "02:30 PM" },
  { id: 15, key: "03:00 PM", label: "03:00 PM" },
  { id: 16, key: "03:30 PM", label: "03:30 PM" },
  { id: 17, key: "04:00 PM", label: "04:00 PM" },
  { id: 18, key: "04:30 PM", label: "04:30 PM" },
  { id: 19, key: "05:00 PM", label: "05:00 PM" },
  { id: 20, key: "05:30 PM", label: "05:30 PM" },
  { id: 21, key: "06:00 PM", label: "06:00 PM" },
  { id: 22, key: "06:30 PM", label: "06:30 PM" },
  { id: 23, key: "07:00 PM", label: "07:00 PM" },
  { id: 24, key: "07:30 PM", label: "07:30 PM" },
  { id: 25, key: "08:00 PM", label: "08:00 PM" },
  { id: 26, key: "08:30 PM", label: "08:30 PM" },
  { id: 27, key: "09:00 PM", label: "09:00 PM" },
  { id: 28, key: "09:30 PM", label: "09:30 PM" },
];

export const CANTIDAD_CLASES = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
  { key: "6", label: "6" },
  { key: "7", label: "7" },
  { key: "8", label: "8" },
  { key: "9", label: "9" },
  { key: "10", label: "10" },
  { key: "11", label: "11" },
  { key: "12", label: "12" },
  { key: "13", label: "13" },
  { key: "14", label: "14" },
  { key: "15", label: "15" },
  { key: "16", label: "16" },
];

export const ESTATO_INSCRIPCION: {
  key: string;
  label: string;
  color:
    | "success"
    | "default"
    | "primary"
    | "secondary"
    | "warning"
    | "danger"
    | undefined;
}[] = [
  { key: "sin_pago", label: "Proceso", color: "warning" },
  { key: "pago_pend", label: "Pendiente", color: "primary" },
  { key: "pago_compl", label: "Completo", color: "success" },
];

export const METODOS_PAGO = [
  {
    key: "efect",
    label: "Efectivo",
    path: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/v1739321409/pago-efectivo_yqyjh1.png`,
  },
  {
    key: "yape",
    label: "Yape",
    path: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/v1739321409/yape-logo_lrjwd7.webp`,
  },
  {
    key: "plin",
    label: "Plin",
    path: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/v1739321409/plin_logo_l2wlvo.png`,
  },
  {
    key: "transf",
    label: "Transferencia",
    path: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/v1739321409/transfer-logo_hyadte.png`,
  },
  {
    key: "tarjeta",
    label: "Tarjeta",
    path: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/v1739321409/v1739321410/tarjeta-logo_xwdbke.png`,
  },
  {
    key: "otro",
    label: "Otro",
    path: `${process.env.NEXT_PUBLIC_IMAGE_PATH}/v1739321409/other-logo_oy3urj.png`,
  },
];
