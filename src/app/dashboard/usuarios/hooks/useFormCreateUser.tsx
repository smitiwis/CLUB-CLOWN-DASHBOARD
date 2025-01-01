import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUsuario } from "@/lib/usuarios/schemas";
import { createUsuario } from "@/lib/usuarios/actions";
import { IStateUsuario, IUsuarioForm } from "@/lib/usuarios/definicions";

const useFormCreateUser = () => {
  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateUsuario, IUsuarioForm>(
    createUsuario,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver<IUsuarioForm>(schemaUsuario),
  });

  const onSubmit = (formData: IUsuarioForm) => {
    startTransaction(() => formAction(formData));
  };

  return {
    register,
    handleSubmit,
    errors,
    setError,
    onSubmit,
    loading, // LO QUE DEMORA EN CREAR EL USUARIO
    state, // ESTADO DE LA TRANSACCION O CREACION DEL USUARIO
  };
};

export default useFormCreateUser;