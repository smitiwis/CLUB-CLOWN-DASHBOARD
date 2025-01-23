"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Form,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  CANTIDAD_CLASES,
  DIAS_TALLERES,
  HORAS_CLASES,
  STATUS_MAIN,
} from "@/constants";
import { IDias } from "../definitions";
import { IStateTaller } from "@/lib/talleres/definicions";
import useFormCrearTaller from "../hooks/useFormCrearTaller";

type Props = {
  profesoresOptions: { key: string; label: string }[];
};
const FormCreateTaller: FC<Props> = ({ profesoresOptions }) => {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    onSubmit,
    setValue,
    watch,
    loading,
    state,
    clearErrors,
  } = useFormCrearTaller();

  const [statusForm, setStatusForm] = useState<IStateTaller>(state);

  useEffect(() => {
    if (state && state.field) {
      setStatusForm(state);

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
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-gray-400 mb-4">
          Crear un nuevo Taller
        </h1>

        <Form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
          <div className="flex gap-4 w-full mb-6">
            <div className="flex flex-col gap-4 flex-1 w-full">
              <Input
                {...register("nombre")}
                label="Nombre del Taller"
                size="lg"
                isInvalid={!!errors.nombre}
                errorMessage={errors.nombre?.message}
              />
              <Select
                {...register("id_profesor")}
                label="Profesor"
                items={profesoresOptions}
                size="lg"
                isInvalid={!!errors.id_profesor}
                errorMessage={errors.id_profesor?.message}
              >
                {profesoresOptions.map(({ key, label }) => (
                  <SelectItem key={key}>{label}</SelectItem>
                ))}
              </Select>

              <Select
                {...register("dias")}
                // isMultiline={true}
                items={DIAS_TALLERES}
                label="Dias de clases"
                selectedKeys={watch("dias")}
                endContent={
                  <Chip
                    className="mt-[-14px]"
                    size="lg"
                    variant="light"
                    onClose={() => setValue("dias", [])}
                  />
                }
                onChange={(e) => {
                  const diasStr = e.target.value;
                  const dias = diasStr.split(",") as IDias[];
                  setValue("dias", diasStr ? dias : []);
                  if (diasStr.length) {
                    clearErrors("dias");
                  } else {
                    setError("dias", {
                      type: "min",
                      message: "Debe seleccionar al menos un día",
                    });
                  }
                }}
                renderValue={(items) => {
                  return (
                    <div className="flex gap-x-2 pt-2">
                      {items.map((item) => (
                        <Chip
                          key={item.key}
                          color="primary"
                          variant="bordered"
                          size="sm"
                          onClose={() => {
                            const newDias = watch("dias").filter(
                              (dia: IDias) => dia !== item.data?.key
                            );
                            setValue("dias", newDias);
                            if (newDias.length) {
                              clearErrors("dias");
                            } else {
                              setError("dias", {
                                type: "min",
                                message: "Debe seleccionar al menos un día",
                              });
                            }
                          }}
                        >
                          {item.data?.label}
                        </Chip>
                      ))}
                    </div>
                  );
                }}
                selectionMode="multiple"
                size="lg"
                isInvalid={!!errors.dias}
                errorMessage={errors.dias?.message}
              >
                {(taller) => (
                  <SelectItem key={taller.key} textValue={taller.label}>
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col">
                        <span className="text-small">{taller.label}</span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>

              <div className="flex items-center gap-4">
                <Select
                  {...register("horaInit")}
                  label="Inicio de clases"
                  items={HORAS_CLASES}
                  defaultSelectedKeys={["12:00 PM"]}
                  size="lg"
                  isInvalid={!!errors.horaInit}
                  errorMessage={errors.horaInit?.message}
                >
                  {HORAS_CLASES.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
                <i className="text-2xl icon-hand-o-right" />
                <Select
                  {...register("horaFin")}
                  label="Fin de clases"
                  items={HORAS_CLASES}
                  defaultSelectedKeys={["02:00 PM"]}
                  size="lg"
                  isInvalid={!!errors.horaFin}
                  errorMessage={errors.horaFin?.message}
                >
                  {HORAS_CLASES.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1 w-full">
              <Input
                {...register("precio")}
                label="Precio"
                size="lg"
                type="number"
                defaultValue="250.00"
                placeholder="0.00"
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 ">S/</span>
                  </div>
                }
                isInvalid={!!errors.precio}
                errorMessage={errors.precio?.message}
              />

              <Select
                {...register("cant_clases")}
                label="Cantidad de clases"
                items={CANTIDAD_CLASES}
                defaultSelectedKeys={["8"]}
                size="lg"
                isInvalid={!!errors.cant_clases}
                errorMessage={errors.cant_clases?.message}
              >
                {CANTIDAD_CLASES.map(({ key, label }) => (
                  <SelectItem key={key}>{label}</SelectItem>
                ))}
              </Select>

              <Select
                {...register("estado")}
                label="Estado del Taller"
                items={STATUS_MAIN}
                defaultSelectedKeys={["1"]}
                size="lg"
                isInvalid={!!errors.estado}
                errorMessage={errors.estado?.message}
              >
                {STATUS_MAIN.map(({ key, label }) => (
                  <SelectItem key={key}>{label}</SelectItem>
                ))}
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
            CREAR TALLER
          </Button>
        </Form>
      </div>
    </>
  );
};

export default FormCreateTaller;
