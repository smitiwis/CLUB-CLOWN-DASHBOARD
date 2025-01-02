"use client";

import {
  Alert,
  Button,
  Form,
  Input,
  Select,
  SelectedItems,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import useFormCreateClient from "../hooks/useFormCreateClient";
import { COLORES, GROUPS_CLIENT, IColors } from "@/constants";
import { IStateLead } from "@/lib/clients/definitions";

const FormCreateLead = () => {
  const [showApod, setShowApod] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    state,
    setError,
    watch,
  } = useFormCreateClient();

  const [statusForm, setStatusForm] = useState<IStateLead>(state);

  useEffect(() => {
    if (state && state.field) {
      const { field, message } = state;
      setStatusForm(state);
      setError(field, { message });

      setTimeout(() => {
        setStatusForm(null);
      }, 3000);
    }
  }, [setError, state]);

  return (
    <>
      {!!statusForm && (
        <div className="w-full flex items-center my-3">
          <Alert
            color="warning"
            title={`Campo ${state?.field}`}
            description={state?.message}
          />
        </div>
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("telefono")}
          className="mb-4"
          isRequired
          label="Celular"
          size="lg"
          isInvalid={!!errors.telefono}
          errorMessage={errors.telefono?.message}
        />

        <div className="flex flex-col gap-2">
          <Switch isSelected={showApod} onValueChange={setShowApod} />
          <p className="text-small text-default-500">Apoderado</p>
        </div>

        {showApod && (
          <Input
            {...register("nombre_apo")}
            className="mb-4"
            label="Nombre y apellido del apoderado"
            size="lg"
            isInvalid={!!errors.nombre_apo}
            errorMessage={errors.nombre_apo?.message}
          />
        )}

        <Input
          {...register("nombre")}
          className="mb-4"
          label="Nombres"
          size="lg"
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />
        <Input
          {...register("apellido")}
          className="mb-4"
          label="Apellidos"
          size="lg"
          isInvalid={!!errors.apellido}
          errorMessage={errors.apellido?.message}
        />

        <Input
          {...register("edad")}
          className="mb-4"
          label="Edad"
          size="lg"
          type="number"
          isInvalid={!!errors.edad}
          errorMessage={errors.edad?.message}
        />

        <Select
          {...register("grupo")}
          className="mb-4"
          label="Grupo"
          isDisabled={true}
          items={GROUPS_CLIENT}
          selectedKeys={
            watch().grupo && watch().edad
              ? GROUPS_CLIENT[parseInt(String(watch().grupo)) - 1].key
              : ""
          }
          size="lg"
          isInvalid={!!errors.grupo}
          errorMessage={errors.grupo?.message}
        >
          {GROUPS_CLIENT.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Select
          {...register("estado")}
          className="mb-4"
          label="Estado"
          defaultSelectedKeys={[COLORES[2].key]}
          items={COLORES}
          size="lg"
          isInvalid={!!errors.estado}
          errorMessage={errors.estado?.message}
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

        <Button
          isLoading={loading}
          className="w-full"
          color="primary"
          type="submit"
          size="lg"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default FormCreateLead;
