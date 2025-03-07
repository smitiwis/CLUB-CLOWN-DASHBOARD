/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  IBClientOptions,
  IFMetodosPayOptions,
} from "@/lib/clients/definitions";
import { IBPromoOptions } from "@/lib/promociones/definitions";
import { IBTalleresOptions } from "@/lib/talleres/definicions";
import {
  Alert,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Badge,
  Button,
  Chip,
  Form,
  Image,
  Input,
  Select,
  SelectedItems,
  SelectItem,
  Textarea,
} from "@heroui/react";
import React, { ChangeEvent, FC, useEffect } from "react";
import useFormInscribirCliente from "../hooks/useFormInscribirCliente";
import { ESTATO_INSCRIPCION, METODOS_PAGO } from "@/constants";
import { getColorByStatus, getLabelByStatus } from "@/lib/helpers";

type Props = {
  clientOptions: IBClientOptions[];
  talleresOptions: IBTalleresOptions[];
  promocionesOptions: IBPromoOptions[];
};

const FormRegisterInscripcion: FC<Props> = (props) => {
  const { clientOptions, talleresOptions, promocionesOptions } = props;

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loadingForm,
    stateForm,
    setValue,
    watch,
    clearErrors,

    setFileBaucher,
    setSelectedIdClient,
    setSelectedTaller,
    setSelectedPromocion,

    setPreviewUrl,
    previewUrl,
  } = useFormInscribirCliente();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      console.log("file", file);
      setFileBaucher(file);
      clearErrors("baucher");

      // Generar una URL de vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const id_taller = watch("id_taller");
    if (id_taller) {
      const tallerSelected = talleresOptions.find(
        (taller) => taller.id_taller === id_taller
      );

      if (tallerSelected) {
        setSelectedTaller(tallerSelected);
        setValue("id_taller", tallerSelected.id_taller);
      }
    }
  }, [watch("id_taller")]);

  useEffect(() => {
    const id_taller_promocion = watch("id_taller_promocion");
    if (id_taller_promocion) {
      const promoSelected = promocionesOptions.find(
        (promo) => promo.id_taller_promocion === id_taller_promocion
      );

      if (promoSelected) setSelectedPromocion(promoSelected);
    }
  }, [watch("id_taller_promocion")]);

  return (
    <>
      {!!stateForm && (
        <div className="w-full flex items-center my-3">
          <Alert
            color="warning"
            title={`CUIDADO!`}
            description={stateForm?.message}
          />
        </div>
      )}

      <Form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Select
          {...register("estado_inscripcion")}
          isDisabled
          className="opacity-0 obsolute transform scale-0 hidden"
          color={getColorByStatus(watch("estado_inscripcion"))}
          selectedKeys={[watch("estado_inscripcion")]}
          defaultSelectedKeys={[ESTATO_INSCRIPCION[0].key]}
          label="Estado de inscripción"
          value={[watch("estado_inscripcion")]}
          items={ESTATO_INSCRIPCION}
          variant="flat"
          size="lg"
          isInvalid={!!errors.estado_inscripcion}
          errorMessage={errors.estado_inscripcion?.message}
        >
          {(document) => (
            <SelectItem key={document.key} textValue={document.label}>
              <div className="flex flex-col">
                <span className="text-small">{document.label}</span>
              </div>
            </SelectItem>
          )}
        </Select>

        <div className="flex gap-4 w-full">
          <div className="flex flex-col flex-1 gap-4">
            <Autocomplete
              {...register("id_cliente")}
              onSelectionChange={(id_cliente) => {
                const clientSelected = clientOptions.find(
                  (client) => client.id_cliente === id_cliente
                );
                if (clientSelected) {
                  setSelectedIdClient(clientSelected);
                  setValue("id_cliente", clientSelected.id_cliente);
                }
              }}
              defaultSelectedKey={
                clientOptions.length === 1
                  ? clientOptions[0].id_cliente
                  : undefined
              }
              label="Cliente:"
              isRequired
              defaultItems={clientOptions}
              placeholder="Selecciona un cliente"
              isInvalid={!!errors.id_cliente}
              errorMessage={errors.id_cliente?.message}
              size="lg"
            >
              {(call) => (
                <AutocompleteItem
                  key={call.id_cliente}
                  textValue={`${call.nombre} ${call.apellido}`}
                  startContent={
                    <Avatar
                      isBordered
                      alt={call.telefono}
                      className="flex-shrink-0"
                      size="sm"
                    />
                  }
                >
                  <div className="flex flex-col">
                    <span className="text-small">{`${call.nombre} ${call.apellido}`}</span>
                    <span className="text-tiny text-cyan-500">
                      {call.telefono}
                    </span>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Select
              {...register("id_taller")}
              isRequired
              size="lg"
              label="Taller:"
              placeholder="Selecciona un taller"
              items={talleresOptions}
              defaultSelectedKeys={
                talleresOptions.length === 1
                  ? talleresOptions[0].id_taller
                  : undefined
              }
              renderValue={(talleres: SelectedItems<IBTalleresOptions>) => {
                return talleres.map((taller) => (
                  <div
                    key={taller.key}
                    className="flex flex-col h-[58px] gap-y-1"
                  >
                    <div className="ml-11 flex items-center gap-x-1">
                      <span className="text-tiny text-gray-400 ml-2">
                        {taller.data?.nombre.toLocaleUpperCase()}
                      </span>
                      <span className="text-tiny text-gray-400">
                        {taller.data?.profesor.nombre}{" "}
                        {taller.data?.profesor.apellidos}
                      </span>
                    </div>
                    <div className="ml-[-10px] flex items-center gap-x-1">
                      <Chip variant="light" className=" text-cyan-500">
                        <span className="text-small">
                          S/{taller.data?.precio.toFixed(2)}
                        </span>
                      </Chip>
                      <div>
                        {taller.data?.dias.map((dia) => (
                          <Chip
                            size="sm"
                            key={dia}
                            variant="bordered"
                            color="secondary"
                            className="mr-2 text-cyan-500 border-cyan-500 "
                          >
                            {dia}
                          </Chip>
                        ))}
                      </div>
                      <i className="icon-hand-o-right" />
                      <span className="mx-2 text-tiny text-cyan-500">
                        {taller.data?.hora}
                      </span>
                      <i className="icon-hand-o-right" />
                      <span className="ml-2 text-tiny text-success">
                        {taller.data?.cant_clases} Sesiones
                      </span>
                    </div>
                  </div>
                ));
              }}
            >
              {(taller) => (
                <SelectItem key={taller.id_taller} textValue={taller.id_taller}>
                  <div className="pl-1 flex items-center gap-x-2">
                    <Badge content={taller.cant_clases} color="success">
                      <Button
                        className="rounded-full bg-cyan-500 text-black"
                        isIconOnly
                        size="sm"
                      >
                        <i className="icon-calendar-o text-lg" />
                      </Button>
                    </Badge>
                    <div className="flex flex-col">
                      <div className="flex gap-x-1">
                        <span className="text-small ml-2">
                          {taller.nombre.toLocaleUpperCase()}
                        </span>
                        -
                        <span className="text-small">
                          {taller.profesor.nombre} {taller.profesor.apellidos}
                        </span>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <Chip variant="light" className="pl-0 text-cyan-500">
                          S/{taller.precio.toFixed(2)}
                        </Chip>
                        {taller.dias.map((dia) => (
                          <Chip
                            size="sm"
                            key={dia}
                            variant="bordered"
                            color="secondary"
                            className="text-tiny text-cyan-500 border-cyan-500"
                          >
                            {dia}
                          </Chip>
                        ))}
                        <i className="icon-hand-o-right" />
                        <span className="text-tiny text-cyan-500">
                          {taller.hora}
                        </span>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>

            <Select
              {...register("id_taller_promocion")}
              isRequired
              size="lg"
              label="Promoción:"
              placeholder="Selecciona una promoción"
              items={promocionesOptions}
              defaultSelectedKeys={[watch("id_taller_promocion") || ""]}
              isInvalid={!!errors.id_taller_promocion}
              errorMessage={errors.id_taller_promocion?.message}
              renderValue={(promociones: SelectedItems<IBPromoOptions>) => {
                return promociones.map((promo) => (
                  <div key={promo.key} className="flex items-center gap-x-3">
                    <div className=" flex items-center gap-x-1">
                      <span>{promo.data?.nombre.toLocaleUpperCase()}</span>
                    </div>
                    <i className="icon-hand-o-right" />
                    <div className="flex items-end gap-x-1 text-tiny">
                      <span className="text-gray-400">Dcto:</span>
                      <span className="text-warning">
                        S/{promo.data?.descuento.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ));
              }}
            >
              {(promo) => (
                <SelectItem
                  key={promo.id_taller_promocion}
                  textValue={promo.id_taller_promocion}
                >
                  <div
                    key={promo.id_taller_promocion}
                    className="flex items-center gap-x-3"
                  >
                    <div className=" flex items-center gap-x-1">
                      <span>{promo.nombre.toLocaleUpperCase()}</span>
                    </div>
                    <i className="icon-hand-o-right" />
                    <div className="flex items-end gap-x-1 text-tiny">
                      <span className="text-gray-400">Dcto:</span>
                      <span className="text-warning">
                        S/{promo.descuento.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>

            <Input
              {...register("precio_venta")}
              startContent="S/"
              value={watch("precio_venta")}
              isReadOnly
              isRequired
              label="Precio de venta"
              size="lg"
              color="success"
              isInvalid={!!errors.precio_venta}
              errorMessage={errors.precio_venta?.message}
            />
          </div>
          {previewUrl && (
            <div className="flex flex-col gap-4 h-[300px]">
              <Image
                isZoomed
                alt="boucher"
                src={previewUrl}
                className="max-w-full object-cover"
                height={304}
              />
            </div>
          )}
          <div className="flex flex-col flex-1 gap-4">
            <Input
              {...register("monto")}
              startContent="S/"
              isDisabled={
                !watch("precio_venta") ||
                !watch("id_taller") ||
                !watch("id_cliente") ||
                !watch("id_taller_promocion")
              }
              label="Monto a pagar"
              min={0}
              max={watch("precio_venta")}
              endContent={
                <Chip
                  size="sm"
                  variant="bordered"
                  color={getColorByStatus(watch("estado_inscripcion"))}
                >
                  {getLabelByStatus(watch("estado_inscripcion"))}
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
              isDisabled={
                !watch("monto") || parseInt(watch("monto") || "0") < 25
              }
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
              isDisabled={
                !watch("monto") || parseInt(watch("monto") || "0") < 25
              }
              label="Nro de transacción"
              size="lg"
              isInvalid={!!errors.nro_transaccion}
              errorMessage={errors.nro_transaccion?.message}
            />
          </div>
        </div>
        <div className="w-full mb-4">
          <Textarea
            {...register("observacion")}
            className="w-full"
            isClearable
            label="Observacion"
            placeholder="Describa una observacion de la inscripción"
            size="lg"
            isInvalid={!!errors.observacion}
            errorMessage={errors.observacion?.message}
          />
        </div>

        <Button
          isLoading={loadingForm}
          className="w-full"
          color="primary"
          type="submit"
          size="lg"
        >
          REGISTRAR INSCRIPCIÓN
        </Button>
      </Form>
      {/* <Switch
        onChange={(e) => setShowFormPago(e.target.checked)}
      >
        Registrar 1er Pago
      </Switch> */}
    </>
  );
};

export default FormRegisterInscripcion;
