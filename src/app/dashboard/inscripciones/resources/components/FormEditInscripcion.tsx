/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { IBClientOptions } from "@/lib/clients/definitions";
import { IBPromoOptions } from "@/lib/promociones/definitions";
import { IBTalleresOptions } from "@/lib/talleres/definicions";
import React, { FC, useEffect } from "react";
import { IEditInscripcion } from "../definitions";
import {
  Alert,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Badge,
  Button,
  Chip,
  Form,
  Input,
  Select,
  SelectedItems,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { STATUS_INSCRITOS } from "@/constants";
import { IBUsuarioOptions } from "@/lib/usuarios/definicions";
import { formatearNombre } from "@/lib/helpers";
import useFormEditInscripcion from "./useFormEditInscripcion";

type Props = {
  inscripcion: IEditInscripcion;
  clientes: IBClientOptions[];
  talleres: IBTalleresOptions[];
  promociones: IBPromoOptions[];
  usuarios: IBUsuarioOptions[];
};

const FormEditInscripcion: FC<Props> = (props) => {
  const { clientes, talleres, promociones, inscripcion, usuarios } = props;

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loadingForm,
    stateForm,
    setValue,
    watch,
    // clearErrors,

    // setFileBaucher,
    setSelectedIdClient,
    setSelectedTaller,
    setSelectedPromocion,

    // setPreviewUrl,
    // previewUrl,
  } = useFormEditInscripcion(inscripcion);

  useEffect(() => {
    const id_taller = watch("id_taller");
    if (id_taller) {
      const tallerSelected = talleres.find(
        (taller) => taller.id_taller === id_taller
      );

      if (tallerSelected) setSelectedTaller(tallerSelected);
    }
  }, [watch("id_taller")]);

  useEffect(() => {
    const id_taller_promocion = watch("id_taller_promocion");
    if (id_taller_promocion) {
      const promoSelected = promociones.find(
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Autocomplete
          {...register("id_cliente")}
          onSelectionChange={(id_cliente) => {
            const clientSelected = clientes.find(
              (client) => client.id_cliente === id_cliente
            );
            if (clientSelected) {
              setSelectedIdClient(clientSelected);
              setValue("id_cliente", clientSelected.id_cliente);
            }
          }}
          label="Cliente:"
          isRequired
          defaultItems={clientes}
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
                <span className="text-tiny text-cyan-500">{call.telefono}</span>
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
          items={talleres}
          defaultSelectedKeys={[watch("id_taller")]}
          isInvalid={!!errors.id_taller}
          errorMessage={errors.id_taller?.message}
          renderValue={(talleres: SelectedItems<IBTalleresOptions>) => {
            return talleres.map((taller) => (
              <div key={taller.key} className="flex flex-col h-[60px] ">
                <div className="ml-11 flex items-center gap-x-1">
                  <span className="text-tiny text-gray-400 ml-2">
                    {taller.data?.nombre.toLocaleUpperCase()} -{" "}
                  </span>
                  <span className="text-tiny text-gray-400">
                    {taller.data?.profesor.nombre}{" "}
                    {taller.data?.profesor.apellidos}
                  </span>
                </div>
                <div className="ml-[-10px] flex items-center gap-x-1">
                  <Chip variant="light" className=" text-cyan-500">
                    S/{taller.data?.precio.toFixed(2)}
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
          items={promociones}
          defaultSelectedKeys={[watch("id_taller_promocion")]}
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

        <Select
          {...register("estado")}
          label="Estado"
          size="lg"
          defaultSelectedKeys={[watch("estado")]}
          isInvalid={!!errors.estado}
          errorMessage={errors.estado?.message}
        >
          {STATUS_INSCRITOS.map(({ key, label }) => (
            <SelectItem key={key}>{label}</SelectItem>
          ))}
        </Select>

        <Select
          {...register("id_usuario")}
          size="lg"
          label="Asesor que inscribio:"
          items={usuarios}
          defaultSelectedKeys={[watch("id_usuario")]}
          isInvalid={!!errors.id_usuario}
          errorMessage={errors.id_usuario?.message}
          renderValue={(users: SelectedItems<IBUsuarioOptions>) => {
            return users.map((user) => (
              <div key={user.key} className="flex users-center gap-2">
                <div className="flex gapx-2 items-center">
                  <span className="text-md">{user.data?.label}</span>
                </div>
              </div>
            ));
          }}
        >
          {(user) => (
            <SelectItem key={user.key} textValue={user.label}>
              <div className="flex gap-2 items-center">
                <div
                  className="w-[1rem] h-[1rem] rounded-full"
                  style={{ background: user.code }}
                />
                <div className="flex flex-col">
                  <span className="text-small">
                    {formatearNombre(user.label, 20)}
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

        <Textarea
          {...register("observacion")}
          className="w-full"
          // value={watch("observacion")}
          isClearable
          label="Observacion"
          placeholder="Describa una observacion de la inscripción"
          size="lg"
          isInvalid={!!errors.observacion}
          errorMessage={errors.observacion?.message}
        />

        <Button isLoading={loadingForm} type="submit" color="primary" size="lg">
          ACTUALIZAR INSCRIPCIÓN
        </Button>
      </Form>
    </>
  );
};

export default FormEditInscripcion;
