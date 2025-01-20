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

export const DIAS_TALLERES = [
  { key: "1", label: "Lunes" },
  { key: "2", label: "Martes" },
  { key: "3", label: "Miercoles" },
  { key: "4", label: "Jueves" },
  { key: "5", label: "Viernes" },
  { key: "6", label: "Sabado" },
  { key: "7", label: "Domingo" },
];

export const HORAS_CLASES = [
  { key: "1", label: "08:00 AM" },
  { key: "2", label: "08:30 AM" },
  { key: "3", label: "09:00 AM" },
  { key: "4", label: "09:30 AM" },
  { key: "5", label: "10:00 AM" },
  { key: "6", label: "10:30 AM" },
  { key: "7", label: "11:00 AM" },
  { key: "8", label: "11:30 AM" },
  { key: "9", label: "12:00 PM" },
  { key: "10", label: "12:30 PM" },
  { key: "11", label: "01:00 PM" },
  { key: "12", label: "01:30 PM" },
  { key: "13", label: "02:00 PM" },
  { key: "14", label: "02:30 PM" },
  { key: "15", label: "03:00 PM" },
  { key: "16", label: "03:30 PM" },
  { key: "17", label: "04:00 PM" },
  { key: "18", label: "04:30 PM" },
  { key: "19", label: "05:00 PM" },
  { key: "20", label: "05:30 PM" },
  { key: "21", label: "06:00 PM" },
  { key: "22", label: "06:30 PM" },
  { key: "23", label: "07:00 PM" },
  { key: "24", label: "07:30 PM" },
  { key: "25", label: "08:00 PM" },
  { key: "26", label: "08:30 PM" },
  { key: "27", label: "09:00 PM" },
  { key: "28", label: "09:30 PM" },
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

export const PROFESOR_CLASES = [
  { key: "1", label: "Profesor 1" },
  { key: "2", label: "Profesor 2" },
  { key: "3", label: "Profesor 3" },
  { key: "4", label: "Profesor 4" },
];
