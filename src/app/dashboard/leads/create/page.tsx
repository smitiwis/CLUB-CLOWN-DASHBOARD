"use client";

import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useActionState,
  useState,
  useTransition,
} from "react";
import {
  Input,
  Spacer,
  Button,
  Select,
  SelectItem,
  DatePicker,
  DateValue,
  SelectedItems,
  form,
} from "@nextui-org/react";

import { createLead } from "@/lib/leads/actions/action";
import { ILeadForm, IStateLead } from "@/lib/leads/definitions/definitions";
import {
  COLORES,
  GRUPOS,
  HORARIOS,
  IColors,
  LEAD_STATUS,
} from "@/app/constants";

const Page = () => {
  const [loading, startTransaction] = useTransition();

  const [state, formAction] = useActionState<IStateLead, ILeadForm>(
    createLead,
    null
  );

  const [formData, setFormData] = useState({
    celular_contacto: "",
    nombre_contacto: "",
    edad_contacto: "",
    categoria_contacto: null,
    grupo_horario: "",
    fecha_inicio_taller: "",
    color: "gris",
    status: "no inscrito",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSlectChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    console.log(e);
    if (!e) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeDate = (date: DateValue | null) => {
    if (!date) return;
    setFormData({
      ...formData,
      fecha_inicio_taller: `${date.year}-${date.month}-${date.day}`,
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransaction(() => formAction(formData));
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg mb-4">Registrar Lead</h2>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-2  gap-3">
          <div>
            {/* Celular del Contacto */}
            <Input
              label="Celular del Contacto"
              name="celular_contacto"
              value={formData.celular_contacto}
              onChange={handleChange}
            />
            <Spacer y={3} />

            <Input
              label="Nombre del Contacto"
              name="nombre_contacto"
              value={formData.nombre_contacto}
              onChange={handleChange}
            />
            <Spacer y={3} />
            {/* Edad del Contacto */}
            <Input
              label="Edad del Contacto"
              name="edad_contacto"
              value={formData.edad_contacto}
              onChange={handleChange}
            />
            <Spacer y={3} />

            {/* Categoría */}
            <Select
              label="Categoria"
              name="categoria_contacto"
              onChange={handleSlectChange}
            >
              {GRUPOS.map((grupo) => (
                <SelectItem key={grupo.key}>{grupo.label}</SelectItem>
              ))}
            </Select>
            <Spacer y={3} />
          </div>
          <div>
            {/* Grupo Horario */}
            <Select
              label="Horario del taller"
              name="grupo_horario"
              onChange={handleSlectChange}
            >
              {HORARIOS.map((horario) => (
                <SelectItem key={horario.key}>{horario.label}</SelectItem>
              ))}
            </Select>
            <Spacer y={3} />

            {/* Fecha de Inicio del Taller */}
            <DatePicker
              name="fecha_inicio_taller"
              label="Fecha de Inicio del Taller"
              onChange={handleChangeDate}
              fullWidth
            />
            <Spacer y={3} />
            
            {/* COLORES */}
            <Select
              label="Colores"
              name="color"
              defaultSelectedKeys={[formData.color || COLORES[0].key]}
              onChange={handleSlectChange}
              items={COLORES}
              renderValue={(items: SelectedItems<IColors>) => {
                return items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <div
                      className="w-[1rem] h-[1rem] rounded-full"
                      style={{ background: item.data?.code }}
                    />
                    <div className="flex flex-col">
                      <span>{item.data?.label}</span>
                    </div>
                  </div>
                ));
              }}
            >
              {(color) => (
                <SelectItem key={color.key} textValue={color.label}>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-[1rem] h-[1rem] rounded-full"
                      style={{ background: color.code }}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{color.label}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>

            <Spacer y={3} />

            {/* Estado del lead */}
            <Select
              label="Status"
              name="status"
              defaultSelectedKeys={[formData.status]}
              onChange={handleSlectChange}
            >
              {LEAD_STATUS.map((status) => (
                <SelectItem key={status.key}>{status.label}</SelectItem>
              ))}
            </Select>
            {/* Botón */}
          </div>
        </div>
        <Button className="w-full" color="primary" type="submit">
          REGISTRAR LEAD
        </Button>
      </form>
    </div>
  );
};

export default Page;
