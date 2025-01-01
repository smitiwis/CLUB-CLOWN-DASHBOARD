"use client";

import React from "react";
import FormUsuario from "./FormUser";
import useFormCreateUser from "../hooks/useFormCreateUser";

const FormCreateUser = () => {
  const { register, handleSubmit, errors, onSubmit, loading, state, setError } =
    useFormCreateUser();

  return (
    <FormUsuario
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      onSubmit={onSubmit}
      loading={loading}
      state={state}
      setError={setError}
    />
  );
};

export default FormCreateUser;
