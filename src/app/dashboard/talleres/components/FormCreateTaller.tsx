"use client";

import React, { FC } from "react";
import {
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

type Props = {
  profesoresOptions: { key: string; label: string }[];
};
const FormCreateTaller: FC<Props> = ({ profesoresOptions }) => {
  return (
    <Form className="flex w-full">
      <div className="flex flex-col gap-4 w-full">
        <Input
          // {...register("nombre")}
          label="Nombre del Taller"
          size="lg"
          // isInvalid={!!errors.nombre}
          // errorMessage={errors.nombre?.message}
        />
        <Select
          // {...register("id_rol")}
          label="Profesor"
          items={profesoresOptions}
          size="lg"
          // isInvalid={!!errors.id_rol}
          // errorMessage={errors.id_rol?.message}
        >
          {profesoresOptions.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>
        <Select
          // isMultiline={true}
          items={DIAS_TALLERES}
          label="Dias de clases"
          renderValue={(items) => {
            return (
              <div className="flex gap-x-2">
                {items.map((item) => (
                  <Chip
                    key={item.key}
                    color="default"
                    variant="faded"
                    onClose={() => console.log("close")}
                  >
                    {item.data?.label}
                  </Chip>
                ))}
              </div>
            );
          }}
          selectionMode="multiple"
          size="lg"
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
            label="Inicio de clases"
            // {...register("tipo")}
            items={HORAS_CLASES}
            defaultSelectedKeys={["2"]}
            size="lg"
            // isInvalid={!!errors.tipo}
            // errorMessage={errors.tipo?.message}
          >
            {HORAS_CLASES.map(({ key, label }) => (
              <SelectItem key={key}>{label}</SelectItem>
            ))}
          </Select>
          <i className="text-2xl icon-hand-o-right" />
          <Select
            // {...register("tipo")}
            label="Fin de clases"
            items={HORAS_CLASES}
            defaultSelectedKeys={["2"]}
            size="lg"
            // isInvalid={!!errors.tipo}
            // errorMessage={errors.tipo?.message}
          >
            {HORAS_CLASES.map(({ key, label }) => (
              <SelectItem key={key}>{label}</SelectItem>
            ))}
          </Select>
        </div>

        <Input
          // {...register("precio")}
          label="Precio"
          size="lg"
          type="number"
          placeholder="0.00"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 ">S/</span>
            </div>
          }
          // isDisabled={hasDataByDocument}
          // isInvalid={!!errors.nombre}
          // errorMessage={errors.nombre?.message}
        />

        <Select
          // {...register("tipo")}
          label="Cantidad de clases"
          items={CANTIDAD_CLASES}
          defaultSelectedKeys={["2"]}
          size="lg"
          // isInvalid={!!errors.tipo}
          // errorMessage={errors.tipo?.message}
        >
          {CANTIDAD_CLASES.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Select
          // {...register("tipo")}
          label="Estado del Taller"
          items={STATUS_MAIN}
          defaultSelectedKeys={["0"]}
          size="lg"
          // isInvalid={!!errors.tipo}
          // errorMessage={errors.tipo?.message}
        >
          {STATUS_MAIN.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>
      </div>

      <Button
        isLoading={false}
        className="w-full"
        color="primary"
        type="submit"
        size="lg"
      >
        CREAR TALLER
      </Button>
    </Form>
  );
};

export default FormCreateTaller;
