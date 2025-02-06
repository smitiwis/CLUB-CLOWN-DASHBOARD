/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUsuarioEdit } from "@/lib/usuarios/schemas";
import { editUsuario } from "@/lib/usuarios/actions";
import {
  IStateUsuario,
  IUsuarioForm,
  IUsuarioReq,
  IUsuarioByIdRes,
} from "@/lib/usuarios/definicions";
import { useActionState, useEffect, useTransition } from "react";

const useFormEditUser = (usuario: IUsuarioByIdRes) => {
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
    watch,
  } = useForm({
    resolver: yupResolver<IUsuarioForm>(schemaUsuarioEdit),
  });

  const onSubmit = (formData: IUsuarioForm) => {
    const data = { ...formData, id_usuario: usuario.id_usuario};
    startTransaction(() => formAction(data));
  };

  useEffect(() => {
    if (!!usuario) {
      reset({...usuario, id_rol: usuario.rol.id_rol});
    }
  }, []);

  return {
    register,
    handleSubmit,
    errors,
    setError,
    onSubmit,
    watch,
    loading, // LO QUE DEMORA EN CREAR EL USUARIO
    state, // ESTADO DE LA TRANSACCION O CREACION DEL USUARIO
  };
};

export default useFormEditUser;
