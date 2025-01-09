/* eslint-disable react-hooks/exhaustive-deps */
import { Key, useState, useTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IBClientRes, IStateCliente } from "@/lib/clients/definitions";
import { IFormClientCall } from "@/lib/llamadas/definitions";
import { schemaClientLlamada } from "@/lib/llamadas/schema";
import { createClientLlamada } from "@/lib/llamadas/actions";
import { isBefore } from "@formkit/tempo";

const useFormRegisterCall = () => {
  const [selectedIdClient, setSelectedIdClient] = useState<Key | null>("");
  const [clientSelected, setClientSelected] = useState<IBClientRes>();

  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateCliente, IFormClientCall>(
    createClientLlamada,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<IFormClientCall>({
    defaultValues: {
      estado: "3",
      observacion: "",
      tipo: "2",
      resultado: "2",
      fecha_agendada: undefined,
    },
    resolver: yupResolver<IFormClientCall>(schemaClientLlamada),
  });

  const onSubmit = (formData: IFormClientCall) => {
    if (clientSelected) {
      startTransaction(() =>
        formAction({ ...formData, id_cliente: clientSelected.id_cliente })
      );
    }
  };

  useEffect(() => {
    if (typeof selectedIdClient === "string") {
      setValue("id_cliente", selectedIdClient);
      clearErrors("id_cliente");
    }
  }, [selectedIdClient]);

  useEffect(() => {
    if (watch("resultado") !== "5") {
      setValue("fecha_agendada", undefined);
    }
  }, [watch("resultado")]);

  useEffect(() => {
    const fechaAgendada = watch("fecha_agendada");
    const resultadoLllamada = watch("resultado");

    if (fechaAgendada && resultadoLllamada === "5") {
      if (isBefore(fechaAgendada, new Date())) {
        setError("fecha_agendada", {
          type: "min",
          message: "La fecha debe ser mayor a la fecha actual",
        });
      } else {
        clearErrors("fecha_agendada");
      }
    }else{
      setValue("fecha_agendada", undefined);
    }
    // setValue("fecha_agendada", new Date());
  }, [watch("fecha_agendada"), watch("resultado")]);

  return {
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
    selectedIdClient,
    clientSelected,
    setClientSelected,
    setSelectedIdClient,
  };
};

export default useFormRegisterCall;
