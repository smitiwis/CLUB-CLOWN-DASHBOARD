/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUsuario } from "@/lib/usuarios/schemas";
import { createUsuario } from "@/lib/usuarios/actions";
import { IStateUsuario, IUsuarioForm } from "@/lib/usuarios/definicions";
import { useActionState, useEffect, useTransition } from "react";

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
    reset,
  } = useForm({
    resolver: yupResolver<IUsuarioForm>(schemaUsuario),
  });

  const onSubmit = (formData: IUsuarioForm) => {
    startTransaction(() => formAction(formData));
  };

  useEffect(() => {
    reset({
      nombre: "data",
      apellido: "data",
      telefono: "964912022",
      dni: "12345678",
      fecha_ingreso: "2021-10-10",
      estado: "activo",
      correo: "data@gmail.com",
      password: "datadata",
    });
  }, []);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading, // LO QUE DEMORA EN CREAR EL USUARIO
    state,   // ESTADO DE LA TRANSACCION O CREACION DEL USUARIO
  };
};

export default useFormCreateUser;
