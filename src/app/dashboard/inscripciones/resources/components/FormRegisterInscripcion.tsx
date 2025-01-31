"use client";

import { IBClientOptions } from "@/lib/clients/definitions";
import { IBPromoOptions } from "@/lib/promociones/definitions";
import { IBTalleresOptions } from "@/lib/talleres/definicions";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Badge,
  Button,
  Chip,
  Form,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { FC } from "react";
import useFormInscribirCliente from "../hooks/useFormInscribirCliente";

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
    // loading,
    // state,
    setValue,
    // setError,
    // clearErrors,
    watch,

    setSelectedIdClient,
    setSelectedTaller,
    setSelectedPromocion,
  } = useFormInscribirCliente();

  return (
    <>
      <Form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
                  textValue={call.nombre}
                  startContent={
                    <Avatar
                      alt={call.telefono}
                      className="flex-shrink-0"
                      size="sm"
                    />
                  }
                >
                  <div className="flex flex-col">
                    <span className="text-small">{call.nombre}</span>
                    <span className="text-tiny text-cyan-500">
                      {call.telefono}
                    </span>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Autocomplete
              {...register("id_taller")}
              onSelectionChange={(id_taller) => {
                const tallerSelected = talleresOptions.find(
                  (taller) => taller.id_taller === id_taller
                );
                if (tallerSelected) {
                  setSelectedTaller(tallerSelected);
                  setValue("id_taller", tallerSelected.id_taller);
                }
              }}
              defaultSelectedKey={
                talleresOptions.length === 1
                  ? talleresOptions[0].id_taller
                  : undefined
              }
              label="Taller:"
              isRequired
              defaultItems={talleresOptions}
              placeholder="Selecciona un taller"
              isInvalid={!!errors.id_taller}
              errorMessage={errors.id_taller?.message}
              size="lg"
            >
              {(taller) => (
                <AutocompleteItem
                  key={taller.id_taller}
                  textValue={taller.nombre}
                  startContent={
                    <Badge content={taller.cant_clases} color="success">
                      <Button
                        className="rounded-full bg-cyan-500 text-black"
                        isIconOnly
                        size="sm"
                      >
                        <i className="icon-calendar-o text-lg" />
                      </Button>
                    </Badge>
                  }
                >
                  <div className="pl-1 flex flex-col">
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
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Autocomplete
              {...register("id_taller_promocion")}
              onSelectionChange={(id_promocion) => {
                const promoSelected = promocionesOptions.find(
                  (promo) => promo.id_taller_promocion === id_promocion
                );
                if (promoSelected) {
                  setSelectedPromocion(promoSelected);
                  setValue(
                    "id_taller_promocion",
                    promoSelected.id_taller_promocion
                  );
                }
              }}
              defaultSelectedKey={
                promocionesOptions.length === 1
                  ? promocionesOptions[0].id_taller_promocion
                  : undefined
              }
              label="Promoción:"
              defaultItems={promocionesOptions}
              placeholder="Selecciona una promoción"
              isInvalid={!!errors.id_taller_promocion}
              errorMessage={errors.id_taller_promocion?.message}
              size="lg"
            >
              {(promo) => (
                <AutocompleteItem
                  key={promo.id_taller_promocion}
                  textValue={promo.nombre}
                  endContent={
                    <Chip variant="light" color="warning">
                      Dcto: S/{promo.descuento.toFixed(2)}
                    </Chip>
                  }
                >
                  <div className="pl-1 flex flex-col">
                    <div className="flex gap-x-2">
                      <span className="text-small">
                        {promo.nombre.toLocaleUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-tiny text-cyan-500">
                        {promo.detalles}
                      </span>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
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
          <div className="flex flex-col flex-1 gap-4">
            <Input
              {...register("monto")}
              startContent="S/"
              isDisabled={!watch("precio_venta")}
              label="Monto a pagar"
              min={0}
              max={watch("precio_venta")}
              type="number"
              size="lg"
              isInvalid={!!errors.monto}
              errorMessage={errors.monto?.message}
            />
            <Select
              {...register("metodo_pago")}
              isDisabled={!watch("monto") || parseInt(watch("monto") || "0") < 25}
              label="Método de pago"
              items={[
                { key: "efect", label: "Efectivo" },
                { key: "yape", label: "Yape" },
                { key: "plin", label: "Plin" },
                { key: "transf", label: "Transferencia" },
                { key: "tarjeta", label: "Tarjeta" },
                { key: "otro", label: "Otro" },
              ]}
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
              isDisabled={!watch("monto") || parseInt(watch("monto") || "0") < 25}
              startContent={<i className="icon-picture-o" />}
              label="Baucher de pago"
              size="lg"
              type="file"
              isInvalid={!!errors.baucher}
              errorMessage={errors.baucher?.message}
            />
            <Select
              {...register("estado_inscripcion")}
              isDisabled
              color={
                watch("estado_inscripcion") === "sin_pago"
                  ? "warning"
                  : watch("estado_inscripcion") === "pago_pend"
                  ? "primary"
                  : "success"
              }
              selectedKeys={[watch("estado_inscripcion")]}
              defaultSelectedKeys={["sin_pago"]}
              label="Estado de pago"
              value={[watch("estado_inscripcion")]}
              items={[
                { key: "sin_pago", label: "Proceso" },
                { key: "pago_pend", label: "Pendiente" },
                { key: "pago_compl", label: "Completo" },
              ]}
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
          </div>
        </div>

        <Button
          // isLoading={loading}
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
