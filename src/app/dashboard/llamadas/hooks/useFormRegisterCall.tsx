/* eslint-disable react-hooks/exhaustive-deps */
import { Key, useState, useTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IBClientRes, IStateCliente } from "@/lib/clients/definitions";
import { IFormClientCall } from "@/lib/llamadas/definitions";
import { schemaClientLlamada } from "@/lib/llamadas/schema";
import { createClientLlamada } from "@/lib/llamadas/actions";

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
  } = useForm({
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
