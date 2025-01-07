/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaClient } from "@/lib/clients/schemas";
import { IClientReq, IClientRes, IFClient, IStateUpdateClient } from "@/lib/clients/definitions";
import { editClient } from "@/lib/clients/actions/action";

const useFormEditClient = (client: IClientRes, redirect: boolean) => {
  
  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateUpdateClient, IClientReq>(
    editClient,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver<IFClient>(schemaClient),
  });

  const onSubmit = (formData: IFClient) => {
    const data = { ...formData, id_cliente: client.id_cliente, redirect };
    startTransaction(() => formAction(data));
  };

  useEffect(() => {
    const edad = parseInt(watch("edad") || "", 10);

    const grupos = [
      { min: 9, max: 12, grupo: "1" },
      { min: 13, max: 17, grupo: "2" },
      { min: 18, max: 55, grupo: "3" },
    ];

    const grupo =
      grupos.find(({ min, max }) => edad >= min && edad <= max)?.grupo || "";
    setValue("grupo", grupo);
  }, [watch().edad]);

  useEffect(() => {
    reset(client);
  }, []);

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
  };
};

export default useFormEditClient;
