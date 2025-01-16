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
import { DOCUMENTS } from "@/constants";
import { IRolesOptions } from "@/lib/definitions";

type Props = {
  usuario: IUsuarioRes;
  roles: IRolesOptions[];
};

const FormEditUser: FC<Props> = ({ usuario, roles }) => {
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
            <div className="flex gap-x-3 mb-4">
              <Select
                {...register("tipo_documento")}
                isDisabled={true}
                defaultSelectedKeys={[DOCUMENTS[0].key]}
                className="w-[20%]"
                label="Tipo doc"
                items={DOCUMENTS}
                size="lg"
                isInvalid={!!errors.tipo_documento}
                errorMessage={errors.tipo_documento?.message}
              >
                {(document) => (
                  <SelectItem key={document.key} textValue={document.label}>
                    <div className="flex flex-col">
                      <span className="text-small">{document.label}</span>
                    </div>
                  </SelectItem>
                )}
              </Select>
              <Input
                {...register("nro_documento")}
                isDisabled={true}
                className="w-[80%]"
                label="Nro de documento"
                size="lg"
                isInvalid={!!errors.nro_documento}
                errorMessage={errors.nro_documento?.message}
              />
            </div>
            <Input
              {...register("nombre")}
              isDisabled={true}
              className="mb-4"
              label="Nombres"
              size="lg"
              isInvalid={!!errors.nombre}
              errorMessage={errors.nombre?.message}
            />

            <Input
              {...register("apellido")}
              isDisabled={true}
              className="mb-4"
              label="Apellidos"
              size="lg"
              isInvalid={!!errors.apellido}
              errorMessage={errors.apellido?.message}
            />

            <div className="flex gap-x-3 mb-4">
              <Input
                {...register("direccion")}
                className="w-[75%]"
                label="Dirección"
                size="lg"
                isInvalid={!!errors.direccion}
                errorMessage={errors.direccion?.message}
              />
              <Input
                {...register("nro_direccion")}
                className="w-[25%]"
                label="Nro."
                size="lg"
                isInvalid={!!errors.nro_direccion}
                errorMessage={errors.nro_direccion?.message}
              />
            </div>

            <Select
              {...register("id_rol")}
              className="mb-4"
              label="Rol"
              size="lg"
              isInvalid={!!errors.id_rol}
              errorMessage={errors.id_rol?.message}
            >
              {roles.map(({ rolId, label }) => (
                <SelectItem key={rolId}>{label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col flex-1">
            <Input
              {...register("telefono")}
              className="mb-4"
              label="Celular"
              size="lg"
              isInvalid={!!errors.telefono}
              errorMessage={errors.telefono?.message}
            />
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
