"use client";

import { Button, Input } from "@nextui-org/react";
import React from "react";
import useFormCreateUser from "../hooks/useFormCreateUser";

const Page = () => {
  const { register, handleSubmit, errors, onSubmit } = useFormCreateUser();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name")}
        className="mb-4"
        label="Name del Contacto"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      <Button className="w-full" color="primary" type="submit">
        REGISTRAR LEAD
      </Button>
    </form>
  );
};

export default Page;
