/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaClient } from "@/lib/leads/schemas";
import { IFClient, IStateLead } from "@/lib/leads/definitions";
import { createLead } from "@/lib/leads/actions/action";

const useFormCreateClient = () => {
  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateLead, IFClient>(
    createLead,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver<IFClient>(schemaClient),
  });

  const onSubmit = (formData: IFClient) => {
    startTransaction(() => formAction(formData));
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

  return {
    register,
    handleSubmit,
    errors,
    setError,
    onSubmit,
    watch,
    loading,
    state,
  };
};

export default useFormCreateClient;
