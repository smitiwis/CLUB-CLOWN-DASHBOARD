"use client";

import React, { FC } from "react";
import FormUsuario from "./FormUser";
import useFormEditUser from "../hooks/useFormEditUser";
import { IUsuarioRes } from "@/lib/usuarios/definicions";

type Props = {
  usuario: IUsuarioRes;
};

const FormEditUser: FC<Props> = ({ usuario }) => {
  const { register, handleSubmit, errors, onSubmit, loading, state, setError } =
    useFormEditUser(usuario);

  return (
    <FormUsuario
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      onSubmit={onSubmit}
      loading={loading}
      state={state}
      setError={setError}
      isToEdit={true}
    />
  );
};

export default FormEditUser;
