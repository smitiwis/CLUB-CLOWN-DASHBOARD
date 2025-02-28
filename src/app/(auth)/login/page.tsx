"use client";

import React, { useState } from "react";
import { Input, Button, Card, Form, Alert } from "@heroui/react";
import EyeOffIcon from "@/components/icons/IconEyeOff";
import IconEye from "@/components/icons/IconEye";
import useFormLogin from "../hooks/useFormLogin";


const Page = () => {
  const { register, handleSubmit, errors, onSubmit, loading, state } =
    useFormLogin();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex flex-col gap-4 max-w-lg w-full p-6 mx-auto">
      {state && (
        <Alert
          color="danger"
          title="Datos Inválidos"
          description={state}
        ></Alert>
      )}
      <Card className=" p-6 shadow-md">
        <div className="text-center text-2xl font-bold mb-7">LOGIN</div>

        <Form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full justify-center items-center space-y-2"
          validationBehavior="native"
        >
          {/* Campo de correo */}
          <Input
            {...register("correo")}
            autoComplete="off"
            isRequired
            label="Correo"
            size="lg"
            type="email"
            isDisabled={loading}
            isInvalid={!!errors.correo}
            errorMessage={errors.correo?.message}
            fullWidth
          />

          {/* Campo de contraseña */}
          <Input
            {...register("password")}
            isRequired
            label="Contraseña"
            className="mb-4"
            size="lg"
            isDisabled={loading}
            type={isVisible ? "text" : "password"}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            autoComplete="off"
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

          {/* Botón de inicio de sesión */}
          <Button
            className="w-full"
            color="primary"
            type="submit"
            size="lg"
            isLoading={loading}
          >
            {loading ? "VALIDANDO ..." : "INICIAR SESSION"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
