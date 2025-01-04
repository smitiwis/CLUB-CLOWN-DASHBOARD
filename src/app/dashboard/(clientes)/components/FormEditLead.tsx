/* eslint-disable react-hooks/exhaustive-deps */
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
import React, { FC, useEffect, useState } from "react";
import { COLORES, GROUPS_CLIENT, IColors } from "@/constants";
import { IClientRes, IStateCliente } from "@/lib/clients/definitions";
import useFormEditClient from "../hooks/useFormEditclient";

type Props = {
  client: IClientRes;
};

const FormEditClient: FC<Props> = ({ client }) => {
  const [showApod, setShowApod] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    state,
    setValue,
    setError,
    watch,
  } = useFormEditClient(client);

  const [statusForm, setStatusForm] = useState<IStateCliente>(state);

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

  useEffect(() => {
    if (!showApod) {
      setValue("nombre_apo", "");
    }
  }, [showApod]);

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
        <div className="w-full flex gap-4">
          <div className="flex flex-col flex-1">
            <Input
              {...register("telefono")}
              className="mb-4"
              isRequired
              label="Celular"
              size="lg"
              isInvalid={!!errors.telefono}
              errorMessage={errors.telefono?.message}
            />

            <div className="flex items-center h-full gap-4 mb-4">
              <div className="flex flex-col gap-2 py-1">
                <Switch isSelected={showApod} onValueChange={setShowApod} />
                <p className="text-small text-default-500">Apoderado</p>
              </div>

              {showApod && (
                <Input
                  {...register("nombre_apo")}
                  label="Nombre y apellido del apoderado"
                  size="lg"
                  isInvalid={!!errors.nombre_apo}
                  errorMessage={errors.nombre_apo?.message}
                />
              )}
            </div>

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
          </div>
          <div className="flex flex-col flex-1">
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
          </div>
        </div>

        <Button
          isLoading={loading}
          className="w-full"
          color="primary"
          type="submit"
          size="lg"
        >
          ACTUALIZAR LEAD
        </Button>
      </Form>
    </>
  );
};

export default FormEditClient;
