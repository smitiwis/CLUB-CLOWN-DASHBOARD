"use client";

import React, { FC, useEffect, useState } from "react";
import useFormEditUser from "../hooks/useFormEditUser";
import { IStateUsuario, IUsuarioRes } from "@/lib/usuarios/definicions";
import {
  Alert,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import EyeOffIcon from "@/components/icons/IconEyeOff";
import IconEye from "@/components/icons/IconEye";

type Props = {
  usuario: IUsuarioRes;
};

const FormEditUser: FC<Props> = ({ usuario }) => {
  const { register, handleSubmit, errors, onSubmit, loading, state, setError } =
    useFormEditUser(usuario);

  const [isVisible, setIsVisible] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [statusForm, setStatusForm] = useState<IStateUsuario>(state);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (state && state.field) {
      const { field, message } = state;
      setStatusForm(state);
      setError(field, { message });

      setTimeout(() => {
        setStatusForm(null);
      }, 3000);
    }
  }, [setError, state]);

  return (
    <>
      {!!statusForm && (
        <div className="w-full flex items-center my-3">
          <Alert
            color="warning"
            title={`Campo ${state?.field}`}
            description={state?.message}
          />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <Input
              {...register("nombre")}
              className="mb-4"
              label="Nombres"
              size="lg"
              isInvalid={!!errors.nombre}
              errorMessage={errors.nombre?.message}
            />

            <Input
              {...register("apellido")}
              className="mb-4"
              label="Apellidos"
              size="lg"
              isInvalid={!!errors.apellido}
              errorMessage={errors.apellido?.message}
            />

            <Input
              {...register("telefono")}
              className="mb-4"
              label="Celular"
              size="lg"
              isInvalid={!!errors.telefono}
              errorMessage={errors.telefono?.message}
            />

            <Input
              {...register("dni")}
              className="mb-4"
              label="Nro. DNI"
              size="lg"
              isInvalid={!!errors.dni}
              errorMessage={errors.dni?.message}
            />
          </div>
          <div className="flex flex-col flex-1">
            <Input
              {...register("fecha_ingreso")}
              className="mb-4"
              label="Fecha de Ingreso"
              size="lg"
              type="date"
              isInvalid={!!errors.fecha_ingreso}
              errorMessage={errors.fecha_ingreso?.message}
            />

            <Select
              {...register("estado")}
              className="mb-4"
              label="Estado"
              size="lg"
              isInvalid={!!errors.estado}
              errorMessage={errors.estado?.message}
            >
              {[
                { key: 1, label: "Activo" },
                { key: 0, label: "Inactivo" },
              ].map((status) => (
                <SelectItem key={status.key}>{status.label}</SelectItem>
              ))}
            </Select>

            <Input
              {...register("correo")}
              autoComplete="off"
              className="mb-4"
              label="Correo"
              size="lg"
              type="email"
              isInvalid={!!errors.correo}
              errorMessage={errors.correo?.message}
            />
            <div className="flex gap-x-4 items-center mb-4 h-full">
              <div className="flex flex-col gap-2">
                <Switch isSelected={showPass} onValueChange={setShowPass} />
                <p className="text-small text-default-500">Contraseña</p>
              </div>
              {showPass && (
                <Input
                  {...register("password")}
                  aria-label="toggle password visibility"
                  label="Contraseña"
                  size="lg"
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
              )}
            </div>
          </div>
        </div>

        <Button
          isLoading={loading}
          className="w-full"
          color="primary"
          type="submit"
          size="lg"
        >
          ACTUALIZAR USUARIO
        </Button>
      </form>
    </>
  );
};

export default FormEditUser;
