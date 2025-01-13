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
  Spinner,
  Switch,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import useFormCreateClient from "../hooks/useFormCreateClient";
import {
  COLORES,
  DOCUMENTS,
  GROUPS_CLIENT,
  IColors,
  IOptionSelect,
  ORIGENES_CLIENTS,
} from "@/constants";
import { IStateCliente } from "@/lib/clients/definitions";

const FormcreateClient = () => {
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
    loadingInfo,
    hasDataByDocument,
  } = useFormCreateClient();

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

            <Select
              {...register("origen")}
              className="mb-4"
              label="Origen del cliente"
              defaultSelectedKeys={[ORIGENES_CLIENTS[0].key]}
              items={ORIGENES_CLIENTS}
              size="lg"
              isInvalid={!!errors.origen}
              errorMessage={errors.origen?.message}
              renderValue={(items: SelectedItems<IOptionSelect>) => {
                return items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <div>I</div>
                    <div className="flex flex-col">
                      <span>{item.data?.label}</span>
                    </div>
                  </div>
                ));
              }}
            >
              {({ key, label }) => (
                <SelectItem key={key} textValue={label}>
                  <div className="flex gap-x-2">
                    <div>I</div>
                    <span className="text-small">{label}</span>
                  </div>
                </SelectItem>
              )}
            </Select>

            <div className="flex gap-x-3 mb-4">
              <Select
                {...register("tipo_documento")}
                className="w-[35%]"
                label="Tipo doc"
                items={DOCUMENTS}
                size="lg"
                isInvalid={!!errors.tipo_documento}
                errorMessage={errors.tipo_documento?.message}
              >
                {(document) => (
                  <SelectItem key={document.key} textValue={document.label}>
                    <div className="flex flex-col">
                      <span className="text-small">{document.label}</span>
                    </div>
                  </SelectItem>
                )}
              </Select>
              <Input
                {...register("nro_documento")}
                endContent={loadingInfo && <Spinner />}
                className="w-[65%]"
                isDisabled={!watch().tipo_documento || loadingInfo}
                value={watch().nro_documento}
                label="Nro de documento"
                size="lg"
                isInvalid={!!errors.nro_documento}
                errorMessage={errors.nro_documento?.message}
              />
            </div>

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
              isDisabled={hasDataByDocument}
              value={watch("nombre")}
              isInvalid={!!errors.nombre}
              errorMessage={errors.nombre?.message}
            />
          </div>
          <div className="flex flex-col flex-1">
            <Input
              {...register("apellido")}
              className="mb-4"
              label="Apellidos"
              size="lg"
              isDisabled={hasDataByDocument}
              value={watch("apellido")}
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
            <div className="flex gap-x-3 mb-4">
              <Input
                {...register("direccion")}
                className="w-[75%]"
                label="Dirección"
                size="lg"
                isInvalid={!!errors.direccion}
                errorMessage={errors.direccion?.message}
              />
              <Input
                {...register("nro_direccion")}
                className="w-[25%]"
                label="Nro."
                size="lg"
                isInvalid={!!errors.nro_direccion}
                errorMessage={errors.nro_direccion?.message}
              />
            </div>
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
          REGISTRAR LEAD
        </Button>
      </Form>
    </>
  );
};

export default FormcreateClient;
