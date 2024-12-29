"use client";

import { Alert, Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import useFormCreateUser from "../hooks/useFormCreateUser";
import IconEye from "@/components/icons/IconEye";
import EyeOffIcon from "@/components/icons/IconEyeOff";

const Page = () => {
  const { register, handleSubmit, errors, onSubmit, loading, state } =
    useFormCreateUser();
  const [isVisible, setIsVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (state) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    setShowAlert(!!state);
  }, [state]);
  return (
    <>
      {showAlert && (
        <div className="w-full flex items-center my-3">
          <Alert
            color="warning"
            title={`Campo ${state?.field}`}
            description={state?.message}
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("nombre")}
          className="mb-4"
          label="Nombres"
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />

        <Input
          {...register("apellido")}
          className="mb-4"
          label="Apellidos"
          isInvalid={!!errors.apellido}
          errorMessage={errors.apellido?.message}
        />

        <Input
          {...register("telefono")}
          className="mb-4"
          label="Celular"
          isInvalid={!!errors.telefono}
          errorMessage={errors.telefono?.message}
        />

        <Input
          {...register("dni")}
          className="mb-4"
          label="Nro. DNI"
          isInvalid={!!errors.dni}
          errorMessage={errors.dni?.message}
        />

        <Input
          {...register("fecha_ingreso")}
          className="mb-4"
          label="Fecha de Ingreso"
          type="date"
          isInvalid={!!errors.fecha_ingreso}
          errorMessage={errors.fecha_ingreso?.message}
        />

        <Select
          {...register("estado")}
          className="mb-4"
          label="Status"
          isInvalid={!!errors.estado}
          errorMessage={errors.estado?.message}
        >
          {[
            { key: "activo", label: "Active" },
            { key: "inactivo", label: "Inactive" },
          ].map((status) => (
            <SelectItem key={status.key}>{status.label}</SelectItem>
          ))}
        </Select>

        <Input
          {...register("correo")}
          className="mb-4"
          label="Correo"
          type="email"
          isInvalid={!!errors.correo}
          errorMessage={errors.correo?.message}
        />

        <Input
          {...register("password")}
          aria-label="toggle password visibility"
          className="mb-4"
          label="Contraseña"
          type={isVisible ? "text" : "password"}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? <EyeOffIcon /> : <IconEye />}
            </button>
          }
        />

        <Button
          isLoading={loading}
          className="w-full"
          color="primary"
          type="submit"
        >
          REGISTRAR LEAD
        </Button>
      </form>
    </>
  );
};

export default Page;
