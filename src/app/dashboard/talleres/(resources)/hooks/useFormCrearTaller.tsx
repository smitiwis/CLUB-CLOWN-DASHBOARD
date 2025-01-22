/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFormTaller } from "../definitions";
import { formTallerSchema } from "../schema";
import { useActionState, useTransition } from "react";
import { IBFormTaller, IStateTaller } from "@/lib/talleres/definicions";
import { createTaller } from "@/lib/talleres/actions";

const useFormCrearTaller = () => {
  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateTaller, IBFormTaller>(
    createTaller,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
    watch,
    setValue,
    clearErrors,
  } = useForm<IFormTaller>({
    resolver: yupResolver<IFormTaller>(formTallerSchema),
  });

  const onSubmit = (formData: IFormTaller) => {
    console.log("formData", formData);
    const  body = {
      id_profesor: formData.id_profesor,
      nombre: formData.nombre,
      dias: formData.dias,
      hora: formData.horaInit + " - " + formData.horaFin,
      precio: formData.precio,
      cant_clases: formData.cant_clases,
      estado: formData.estado,
    }
    startTransaction(() => formAction(body));

  };
  return {
    register,
    handleSubmit,
    errors,
    setError,
    onSubmit,
    setValue,
    watch,
    trigger,
    clearErrors,
    loading,
    state,
  };
};

export default useFormCrearTaller;
