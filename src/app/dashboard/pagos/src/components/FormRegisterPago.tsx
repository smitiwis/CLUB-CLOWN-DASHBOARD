"use client";

import { METODOS_PAGO } from "@/constants";
import {
  Alert,
  Button,
  Chip,
  Form,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { FC } from "react";
import { IBInscritosOptions } from "../definitions";
import useFormRegistrarPago from "../hooks/useFormRegistrarPago";
import { formatearNombre } from "@/lib/helpers";

type Props = {
  inscritosOptions: IBInscritosOptions[];
};

const FormRegisterPago: FC<Props> = ({ inscritosOptions }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    clientSelected,
    watch,
    state,
  } = useFormRegistrarPago(inscritosOptions);

  return (
    <>
      {!!state && (
        <div className="w-full flex items-center my-3">
          <Alert
            color="warning"
            title={`Campo ${state?.field}`}
            description={state?.message}
          />
        </div>
      )}
      <Form className="flex flex-col gap-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full gap-4">
          <Select
            {...register("id_taller_cliente")}
            label="Seleccionar cliente inscrito"
            items={inscritosOptions}
            size="lg"
            isInvalid={!!errors.id_taller_cliente}
            errorMessage={errors.id_taller_cliente?.message}
          >
            {(inscrito) => {
              const nombreCompleto = `${inscrito.nombre} ${inscrito.apellido}`;
              return (
                <SelectItem
                  key={inscrito.id_cliente}
                  textValue={formatearNombre(nombreCompleto, 30)}
                >
                  <div className="flex flex-col">
                    <span className="text-small">
                      {formatearNombre(nombreCompleto, 30)}
                    </span>
                  </div>
                </SelectItem>
              );
            }}
          </Select>


          <Input
            {...register("monto")}
            isDisabled={!watch("id_taller_cliente")}
            startContent="S/"
            label={`Monto a pagar ${
              clientSelected
                ? ` (Saldo pendiente: S/${clientSelected.saldoPendiente.toFixed(
                    2
                  )})`
                : ""
            }`}
            min={0}
            max={clientSelected?.saldoPendiente}
            endContent={
              <Chip
                size="sm"
                variant="bordered"
                // color={getColorByStatus(clientSelected.e)}
              >
                { 
                  parseFloat(watch("monto")) > 0 && parseFloat(watch("monto")) < (clientSelected?.saldoPendiente || 0)
                }
              </Chip>
            }
            size="lg"
            isInvalid={!!errors.monto}
            errorMessage={errors.monto?.message}
          />

          <Select
            {...register("metodo_pago")}
            isDisabled={!watch("id_taller_cliente")}
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
            isDisabled={!watch("id_taller_cliente")}
            startContent={<i className="icon-picture-o" />}
            label="Baucher de pago"
            size="lg"
            type="file"
            isInvalid={!!errors.baucher}
            errorMessage={errors.baucher?.message}
          />
          <Input
            {...register("nro_transaccion")}
            isDisabled={!watch("id_taller_cliente")}
            label="Nro de transacción"
            size="lg"
            isInvalid={!!errors.nro_transaccion}
            errorMessage={errors.nro_transaccion?.message}
          />
        </div>
        <Button
          isLoading={loading}
          className="w-full"
          color="primary"
          type="submit"
          size="lg"
        >
          REGISTRAR PAGO
        </Button>
      </Form>
    </>
  );
};

export default FormRegisterPago;
