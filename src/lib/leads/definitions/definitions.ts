export type ILeadForm = {
  nombre_contacto: string;
  celular_contacto: string;
  edad_contacto: string;
  categoria_contacto: string | null;
  grupo_horario: string;
  fecha_inicio_taller: string;
  color: string;
  status: string;
};

export interface ILead extends ILeadForm {
  id: string;
}

// ERRORES
export type IStateLead = {
  errors?: {
    nombre_contacto?: string[];
    celular_contacto?: string[];
    edad_contacto?: string[];
    categoria_contacto?: string[];
    grupo_horario?: string[];
    fecha_inicio_taller?: string[];
    color?: string[];
    status?: string[];
  };
  message?: string | null;
} | null;
