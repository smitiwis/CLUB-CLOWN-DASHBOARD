import {
  CATEGORIA_CLIENT,
  COLORES,
  DOCUMENTS,
  ESTATO_INSCRIPCION,
  GROUPS_CLIENT,
  ORIGENES_CLIENTS,
  RESULTADO_LLAMADAS,
  STATUS_INSCRITOS,
  TIPO_LLAMADAS,
} from "@/constants";

export const getColor = (estado: string) => {
  return COLORES.find(({ key }) => key === estado)?.code || "";
};

export const getLabelColor = (estado: string) => {
  return COLORES.find(({ key }) => key === estado)?.label || "";
};

export const getKeyColor = (estado: string) => {
  return (
    COLORES.find(({ key }) => parseInt(key) === parseInt(estado))?.key || ""
  );
};

export const getGrupoCliente = (grupo: string) => {
  return GROUPS_CLIENT.find(({ key }) => key === grupo)?.label || "";
};

export const getOrigenCliente = (grupo: string) => {
  return ORIGENES_CLIENTS.find(({ key }) => key === grupo)?.label || "";
};

export const getTipeDocument = (tipo: string) => {
  return DOCUMENTS.find(({ key }) => key === tipo)?.label || "";
};

export const getTipeLlamada = (tipo: string) => {
  return TIPO_LLAMADAS.find(({ key }) => key === tipo)?.label || "";
};

export const getResultLlamada = (tipo: string) => {
  return RESULTADO_LLAMADAS.find(({ key }) => key === tipo)?.label || "";
};

export function toCapitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export function getColorByStatus(status: string) {
  return (
    ESTATO_INSCRIPCION.find(({ key }) => key === status)?.color || undefined
  );
}

export function getLabelCategoryByKey(key: string) {
  return CATEGORIA_CLIENT.find(({ key: k }) => k === key)?.label || "";
}

export function getLabelInscritoByKey(key: string) {
  return STATUS_INSCRITOS.find(({ key: k }) => k === key)?.label || "";
}

export function getLabelByStatus(status: string) {
  return ESTATO_INSCRIPCION.find(({ key }) => key === status)?.label || "";
}
