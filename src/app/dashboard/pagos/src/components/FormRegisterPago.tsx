"use client";

import { METODOS_PAGO } from "@/constants";
import {
  Alert,
  Button,
  Chip,
  Form,
  Image,
  Input,
  Select,
  SelectedItems,
  SelectItem,
} from "@nextui-org/react";
import React, { ChangeEvent, FC } from "react";
import { IBInscritosOptions } from "../definitions";
import useFormRegistrarPago from "../hooks/useFormRegistrarPago";
import { formatearNombre } from "@/lib/helpers";
import { IFMetodosPayOptions } from "@/lib/clients/definitions";

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
    setFileBaucher,
    previewUrl,
    setPreviewUrl,
  } = useFormRegistrarPago(inscritosOptions);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      setFileBaucher(file);

      // Generar una URL de vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <div className="flex w-full gap-x-4">
          <div className="flex flex-[0.75] flex-col gap-y-2">
            <Select
              {...register("id_taller_cliente")}
              label="Seleccionar cliente inscrito"
              items={inscritosOptions}
              size="lg"
              isInvalid={!!errors.id_taller_cliente}
              errorMessage={errors.id_taller_cliente?.message}
              renderValue={(inscritos: SelectedItems<IBInscritosOptions>) => {
                return inscritos.map((inscrito) => {
                  const nombreCompleto = `${inscrito.data?.nombre} ${inscrito.data?.apellido}`;
                  return (
                    <div
                      key={inscrito.key}
                      className="flex gap-x-2 items-center"
                    >
                      <span className="text-small">
                        {formatearNombre(
                          nombreCompleto.toLocaleUpperCase(),
                          30
                        )}
                      </span>
                      <i className="icon-hand-o-right text-success-500" />
                      <span className="text-sm text-cyan-500">
                        {inscrito.data?.taller}
                      </span>
                    </div>
                  );
                });
              }}
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
                      <span className="text-cyan-500">
                        Taller: {inscrito.taller}
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
                  variant="shadow"
                  color={
                    watch("monto")
                      ? parseFloat(watch("monto")) > 0 &&
                        parseFloat(watch("monto")) <
                          (clientSelected?.saldoPendiente || 0)
                        ? "warning"
                        : parseFloat(watch("monto")) ===
                          (clientSelected?.saldoPendiente || 0)
                        ? "success"
                        : "danger"
                      : "default"
                  }
                >
                  {watch("monto")
                    ? parseFloat(watch("monto")) > 0 &&
                      parseFloat(watch("monto")) <
                        (clientSelected?.saldoPendiente || 0)
                      ? `Resta: S/${(
                          (clientSelected?.saldoPendiente || 0) -
                          parseFloat(watch("monto"))
                        ).toFixed(2)}`
                      : parseFloat(watch("monto")) ===
                        (clientSelected?.saldoPendiente || 0)
                      ? "Completo"
                      : "Excedido"
                    : ""}
                </Chip>
              }
              size="lg"
              isInvalid={!!errors.monto}
              errorMessage={errors.monto?.message}
            />

            <Select
              {...register("metodo_pago")}
              isDisabled={
                !watch("monto") || parseInt(watch("monto") || "0") < 25
              }
              label="Método de pago"
              items={METODOS_PAGO}
              size="lg"
              isInvalid={!!errors.metodo_pago}
              errorMessage={errors.metodo_pago?.message}
              renderValue={(pays: SelectedItems<IFMetodosPayOptions>) => {
                return pays.map((pay) => (
                  <div key={pay.key} className="flex users-center gap-2">
                    <div className="flex gap-x-1 items-center">
                      <Image
                        isZoomed
                        alt={pay.data?.label}
                        src={pay.data?.path}
                        width={25}
                        height={25}
                        className="rounded-full"
                      />
                      <span className="text-md">{pay.data?.label}</span>
                    </div>
                  </div>
                ));
              }}
            >
              {(pay) => (
                <SelectItem key={pay.key} textValue={pay.label}>
                  <div className="flex flex-col">
                    <div className="flex gap-x-2 items-center">
                      <Image
                        isZoomed
                        alt={pay?.label}
                        src={pay?.path}
                        width={25}
                        height={25}
                        className="rounded-full"
                      />
                      <span className="text-md">{pay?.label}</span>
                    </div>
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
              accept="image/*"
              onChange={handleFileChange}
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
          <div className="flex flex-[0.25] flex-col  gap-4">
            {previewUrl && (
              <Image
                isZoomed
                alt="boucher"
                src={previewUrl}
                className="max-w-full object-cover"
                width={200}
              />
            )}
          </div>
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
