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
  Switch,
} from "@nextui-org/react";
import React, { FC, useState } from "react";

type Props = {
  clientOptions: IBClientOptions[];
  talleresOptions: IBTalleresOptions[];
  promocionesOptions: IBPromoOptions[];
};

const FormRegisterInscripcion: FC<Props> = ({
  clientOptions,
  talleresOptions,
  promocionesOptions,
}) => {
  const [showFormPago, setShowFormPago] = useState(false);

  return (
    <>
      <Form>
        <Autocomplete
          // {...register("id_cliente")}
          // onSelectionChange={setSelectedIdClient}
          defaultSelectedKey={
            clientOptions.length === 1 ? clientOptions[0].id_cliente : undefined
          }
          className="mb-4"
          label="Cliente:"
          isRequired
          defaultItems={clientOptions}
          placeholder="Selecciona un cliente"
          // isInvalid={!!errors.id_cliente}
          // errorMessage={errors.id_cliente?.message}
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
                <span className="text-tiny text-cyan-500">{call.telefono}</span>
              </div>
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Autocomplete
          // {...register("id_cliente")}
          // onSelectionChange={setSelectedIdClient}
          defaultSelectedKey={
            talleresOptions.length === 1
              ? talleresOptions[0].id_taller
              : undefined
          }
          className="mb-4"
          label="Taller:"
          isRequired
          defaultItems={talleresOptions}
          placeholder="Selecciona un taller"
          // isInvalid={!!errors.id_cliente}
          // errorMessage={errors.id_cliente?.message}
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
              endContent={
                <Chip variant="light" color="warning">
                  S/{taller.precio.toFixed(2)}
                </Chip>
              }
            >
              <div className="pl-1 flex flex-col">
                <div className="flex gap-x-2">
                  <span className="text-small">
                    {taller.nombre.toLocaleUpperCase()}
                  </span>
                  -
                  <span className="text-small">
                    {taller.profesor.nombre} {taller.profesor.apellidos}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-tiny text-cyan-500">{taller.hora}</span>
                  <i className="icon-hand-o-right" />
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
                </div>
              </div>
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Autocomplete
          // {...register("id_cliente")}
          // onSelectionChange={setSelectedIdClient}
          defaultSelectedKey={
            promocionesOptions.length === 1
              ? promocionesOptions[0].id_taller_promocion
              : undefined
          }
          className="mb-4"
          label="Promoción:"
          isRequired
          defaultItems={promocionesOptions}
          placeholder="Selecciona una promoción"
          // isInvalid={!!errors.id_cliente}
          // errorMessage={errors.id_cliente?.message}
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

        <Select
          // {...register("tipo_documento")}
          className="mb-4"
          label="Estado de la inscripción"
          items={[
            { key: "pago_pend", label: "Pendiente" },
            { key: "pago_comp", label: "Completo" },
          ]}
          size="lg"
          // isInvalid={!!errors.tipo_documento}
          // errorMessage={errors.tipo_documento?.message}
        >
          {(document) => (
            <SelectItem key={document.key} textValue={document.label}>
              <div className="flex flex-col">
                <span className="text-small">{document.label}</span>
              </div>
            </SelectItem>
          )}
        </Select>

        {/* DETECTAR EL PRECIO DEL TALLER QUE ESCOJIO Y RESTAR EL DESCUENTO DE LA PROMO */}
        <Input
          // {...register("telefono")}
          startContent="S/"
          isReadOnly
          defaultValue="250"
          className="mb-4"
          isRequired
          label="Precio de venta"
          size="lg"
          color="success"
          // isInvalid={!!errors.telefono}
          // errorMessage={errors.telefono?.message}
        />
      </Form>
      <Switch
        className="mb-4"
        onChange={(e) => setShowFormPago(e.target.checked)}
      >
        Registrar 1er Pago
      </Switch>

      {showFormPago && (
        <Form>
          <span>Nombre del cliente inscrito en la parte superior</span>
          <Input
            // {...register("telefono")}
            startContent="S/"
            className="mb-4"
            isRequired
            label="Monto a pagar"
            size="lg"
            // isInvalid={!!errors.telefono}
            // errorMessage={errors.telefono?.message}
          />
          <Input
            // {...register("telefono")}
            startContent={<i className="icon-picture-o" />}
            className="mb-4"
            isRequired
            label="Baucher de pago"
            size="lg"
            type="file"
            // isInvalid={!!errors.telefono}
            // errorMessage={errors.telefono?.message}
          />
          <Select
            // {...register("tipo_documento")}
            className="mb-4"
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
            // isInvalid={!!errors.tipo_documento}
            // errorMessage={errors.tipo_documento?.message}
          >
            {(document) => (
              <SelectItem key={document.key} textValue={document.label}>
                <div className="flex flex-col">
                  <span className="text-small">{document.label}</span>
                </div>
              </SelectItem>
            )}
          </Select>
        </Form>
      )}
    </>
  );
};

export default FormRegisterInscripcion;
