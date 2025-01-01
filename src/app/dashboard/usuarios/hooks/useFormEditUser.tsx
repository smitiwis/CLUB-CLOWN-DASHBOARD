/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUsuario } from "@/lib/usuarios/schemas";
import { editUsuario } from "@/lib/usuarios/actions";
import {
  IStateUsuario,
  IUsuarioForm,
  IUsuarioRes,
  IUsuarioReq,
} from "@/lib/usuarios/definicions";
import { useActionState, useEffect, useTransition } from "react";

const useFormEditUser = (usuario: IUsuarioRes) => {
  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateUsuario, IUsuarioReq>(
    editUsuario,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver<IUsuarioForm>(schemaUsuario),
  });

  const onSubmit = (formData: IUsuarioForm) => {
    const data = { ...formData, id_usuario: usuario.id_usuario };
    startTransaction(() => formAction(data));
  };

  useEffect(() => {
    if (!!usuario) {
      reset({ ...usuario, password: "default" });
    }
  }, []);

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

export default useFormEditUser;
