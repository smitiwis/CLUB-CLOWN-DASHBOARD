/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  // Card,
  // CardBody,
  DatePicker,
  Divider,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectedItems,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import useFormRegisterCall from "../hooks/useFormRegisterCall";
import {
  COLORES,
  IColors,
  RESULTADO_LLAMADAS,
  TIPO_LLAMADAS,
} from "@/constants";
import InfoValue from "./InfoValue";
import FormEditClient from "../../(clientes)/components/FormEditLead";
import { getColor, getGrupoCliente, getLabelColor } from "@/lib/helpers";
import { IBClientRes } from "@/lib/clients/definitions";

type Props = {
  clientOptions: IBClientRes[];
};

const FormRegisterCall: FC<Props> = (props) => {
  const [clientOptions, setClientOptions] = useState(props.clientOptions);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    // loading,
    // state,
    // setError,
    watch,
    clientSelected,
    setClientSelected,

    selectedIdClient,
    setSelectedIdClient,
  } = useFormRegisterCall();

  useEffect(() => {
    if (clientOptions.length === 1) {
      setSelectedIdClient(clientOptions[0].id_cliente);
    }
    
    if (selectedIdClient) {
      const currentClient = clientOptions.find(
        ({ id_cliente }) => id_cliente === selectedIdClient
      );

      if (currentClient) setClientSelected(currentClient);
    }
  }, [selectedIdClient]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col flex-1 w-full">
        {/* WATCH: <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        {clientSelected && (
          <Card className=" w-1/2 mx-auto" isHoverable shadow="md">
            <CardHeader className="gap-x-4">
              <h1 className="text-2xl font-semibold text-gray-400">
                Detalles del cliente
              </h1>
            </CardHeader>
            <Divider />

            <CardBody>
              <div className="grid grid-cols-2 gap-2 rounded-md shadow-md">
                {/* <div className="flex flex-col flex-1"> */}
                <InfoValue
                  label="Telefono: "
                  value={
                    <Chip color="secondary" variant="shadow">
                      {clientSelected?.telefono}
                    </Chip>
                  }
                />
                <InfoValue
                  label="Nombre del Apoderado: "
                  value={clientSelected.nombre_apo}
                />
                <InfoValue label="Nombre:" value={clientSelected.nombre} />
                <InfoValue label="Apellido:" value={clientSelected.apellido} />
                <InfoValue
                  label="Edad: "
                  value={
                    clientSelected.edad ? `${clientSelected.edad} años` : ""
                  }
                />
                <InfoValue
                  label="Grupo:"
                  value={getGrupoCliente(clientSelected.grupo)}
                />
                <InfoValue
                  label="Estado:"
                  value={
                    <Chip
                      size="sm"
                      variant="faded"
                      className="flex items-center gap-x-1"
                      style={{ color: getColor(clientSelected.estado) }}
                    >
                      <div className="flex items-center gap-x-2">
                        <div
                          className="w-[0.5rem] h-[0.5rem] rounded-full"
                          style={{
                            background: getColor(clientSelected.estado),
                          }}
                        />
                        {getLabelColor(clientSelected.estado)}
                      </div>
                    </Chip>
                  }
                />
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button fullWidth color="primary" onPress={onOpen}>
                ACTUALIZAR VALORES
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <h1 className="text-2xl font-semibold text-gray-400 mb-4">
          Registrar Llamada
        </h1>

        <Form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
          <div className="flex gap-x-4 w-full">
            <div className="flex flex-col flex-1 w-full">
              <Autocomplete
                {...register("id_cliente")}
                onSelectionChange={setSelectedIdClient}
                defaultSelectedKey={clientOptions.length === 1 ? clientOptions[0].id_cliente: undefined}
                className="mb-4"
                label="Llamando a:"
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
                    textValue={call.telefono}
                    startContent={
                      <Avatar
                        alt={call.nombre}
                        className="flex-shrink-0"
                        size="sm"
                      />
                    }
                  >
                    <div className="flex flex-col">
                      <span className="text-small">{call.telefono}</span>
                      <span className="text-tiny text-cyan-500">
                        {call.nombre}
                      </span>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>

              <Textarea
                {...register("observacion")}
                className="mb-4"
                isClearable
                isRequired
                label="Observacion"
                placeholder="Describa la observacion de la llamada"
                size="lg"
                isInvalid={!!errors.observacion}
                errorMessage={errors.observacion?.message}
              />
            </div>

            <div className="flex flex-col flex-1 w-full">
              <Select
                {...register("estado")}
                className="mb-4"
                label="Estado"
                items={COLORES}
                defaultSelectedKeys={[COLORES[2].key]}
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

              <Select
                {...register("tipo")}
                className="mb-4"
                label="Tipo de llamada"
                items={TIPO_LLAMADAS}
                defaultSelectedKeys={["2"]}
                size="lg"
                isInvalid={!!errors.tipo}
                errorMessage={errors.tipo?.message}
              >
                {TIPO_LLAMADAS.map(({ key, label }) => (
                  <SelectItem key={key}>{label}</SelectItem>
                ))}
              </Select>

              <div className="flex gap-x-4">
                <Select
                  {...register("resultado")}
                  className="mb-4"
                  label="Resultado de la llamada"
                  items={RESULTADO_LLAMADAS}
                  defaultSelectedKeys={["2"]}
                  size="lg"
                  isInvalid={!!errors.resultado}
                  errorMessage={errors.resultado?.message}
                >
                  {RESULTADO_LLAMADAS.map(({ key, label }) => (
                    <SelectItem key={key}>{label}</SelectItem>
                  ))}
                </Select>
                {watch("resultado") === "5" && (
                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                    label="Agendar llamada"
                    size="lg"
                  />
                )}
              </div>
            </div>
          </div>

          <Button
            // isLoading={loading}
            className="w-full"
            color="primary"
            type="submit"
            size="lg"
          >
            REGISTRAR LLAMADA
          </Button>
        </Form>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-gray-400">
              Actualizar datos del Lead
            </h1>
          </ModalHeader>
          <Divider className="mb-4"/>
          <ModalBody>
            {clientSelected && (
              <FormEditClient
                client={clientSelected}
                onUpdate={(userUpdate) => {
                  setClientOptions(
                    clientOptions.map((client) => {
                      if (userUpdate.id_cliente === client.id_cliente) {
                        return { ...userUpdate };
                      } else return { ...client };
                    })
                  );
                  setClientSelected(userUpdate);
                  onOpenChange();
                }}
                redirect={false}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* END MODAL */}
    </div>
  );
};

export default FormRegisterCall;
