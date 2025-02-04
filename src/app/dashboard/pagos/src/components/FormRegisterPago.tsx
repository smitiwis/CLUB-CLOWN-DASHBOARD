"use client";

import { METODOS_PAGO } from "@/constants";
import { Button, Form, Input, Select, SelectItem } from "@nextui-org/react";
import React, { FC } from "react";
import { IBInscritosOptions } from "../definitions";
import useFormRegistrarPago from "../hooks/useFormRegistrarPago";

type Props = {
  inscritosOptions: IBInscritosOptions[];
};

const FormRegisterPago: FC<Props> = ({ inscritosOptions }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    // loading,
    // state,
    // setValue,
    // setError,
    // clearErrors,
    // watch,
  } = useFormRegistrarPago();

  return (
    <Form className="flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col w-full gap-4">
        <Select
          {...register("id_taller_cliente")}
          // isDisabled={!watch("monto") || parseInt(watch("monto") || "0") < 25}
          label="Seleccionar cliente inscrito"
          items={inscritosOptions}
          size="lg"
          isInvalid={!!errors.id_taller_cliente}
          errorMessage={errors.id_taller_cliente?.message}
        >
          {(inscritos) => (
            <SelectItem key={inscritos.id_cliente} textValue={inscritos.nombre}>
              <div className="flex flex-col">
                <span className="text-small">{inscritos.nombre}</span>
              </div>
            </SelectItem>
          )}
        </Select>
        <Input
          {...register("monto")}
          startContent="S/"
          // isDisabled={!watch("precio_venta")}
          label="Monto a pagar"
          min={0}
          // max={watch("precio_venta")}
          type="number"
          size="lg"
          isInvalid={!!errors.monto}
          errorMessage={errors.monto?.message}
        />
        <Select
          {...register("metodo_pago")}
          // isDisabled={!watch("monto") || parseInt(watch("monto") || "0") < 25}
          label="Método de pago"
          items={METODOS_PAGO}
          size="lg"
          isInvalid={!!errors.metodo_pago}
          errorMessage={errors.metodo_pago?.message}
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
          {...register("baucher")}
          // isDisabled={!watch("monto") || parseInt(watch("monto") || "0") < 25}
          startContent={<i className="icon-picture-o" />}
          label="Baucher de pago"
          size="lg"
          type="file"
          isInvalid={!!errors.baucher}
          errorMessage={errors.baucher?.message}
        />
        <Input
          {...register("nro_transaccion")}
          label="Nro de transacción"
          size="lg"
          isInvalid={!!errors.nro_transaccion}
          errorMessage={errors.nro_transaccion?.message}
        />
      </div>
      <Button
        // isLoading={loading}
        className="w-full"
        color="primary"
        type="submit"
        size="lg"
      >
        REGISTRAR PAGO
      </Button>
    </Form>
  );
};

export default FormRegisterPago;
