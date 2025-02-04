import { useForm } from "react-hook-form";
import { IF_pago, IStatePago, schemaPago } from "../schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useActionState, useTransition } from "react";
import { registrarPago } from "@/lib/pagos/actions.ts";

const useFormRegistrarPago = () => {
  const [loading, startTransaction] = useTransition();

  const [state, formAction] = useActionState<IStatePago, IF_pago>(
    registrarPago,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    // setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<IF_pago>({
    defaultValues: {
      baucher: "",
    },
    resolver: yupResolver<IF_pago>(schemaPago),
  });

  const onSubmit = (formData: IF_pago) => {
    startTransaction(() => formAction(formData));
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    clearErrors,
    setValue,
    watch,
    loading,
    state,
  };
};

export default useFormRegistrarPago;
