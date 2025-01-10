/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaClient } from "@/lib/clients/schemas";
import {
  IFClient,
  IGruposClients,
  IStateCliente,
} from "@/lib/clients/definitions";
import { createClient } from "@/lib/clients/actions/action";
import axios from "axios";

const useFormCreateClient = () => {
  const [loadingInfo, setLoadigInfo] = useState(false);
  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateCliente, IFClient>(
    createClient,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<IFClient>({
    defaultValues: {
      fecha_agendada: undefined,
    },
    resolver: yupResolver<IFClient>(schemaClient),
  });

  const onSubmit = (formData: IFClient) => {
    startTransaction(() => formAction(formData));
  };

  const getInfoByNroDni = async () => {
    const API = `/api/document/dni/${watch("nro_documento")}`;
    try {
      setLoadigInfo(true);
      const response = await axios.get(API);

      if (response.status === 200) {
        const { data } = response;
        clearErrors("nro_documento");
        setValue("nombre", data.nombres);
        setValue("apellido", data.apellidoPaterno + " " + data.apellidoMaterno);
      }
    } catch (error) {
      console.error(error);
      setValue("nombre", "");
      setValue("apellido", "");
    } finally {
      setLoadigInfo(false);
    }
  };

  useEffect(() => {
    const edad = parseInt(watch("edad") || "", 10);

    const grupos: IGruposClients[] = [
      { min: 9, max: 12, grupo: "1" },
      { min: 13, max: 17, grupo: "2" },
      { min: 18, max: 55, grupo: "3" },
    ];

    const grupo =
      grupos.find(({ min, max }) => edad >= min && edad <= max)?.grupo || "";

    setValue("grupo", grupo);
  }, [watch().edad]);

  useEffect(() => {
    const tipoDocumento = watch("tipo_documento");
    setValue("nro_documento", "");
    if (!tipoDocumento) clearErrors("nro_documento");
  }, [watch("tipo_documento")]);

  useEffect(() => {
    const tipoDocumento = watch("tipo_documento");
    const nroDocumento = watch("nro_documento");

    switch (tipoDocumento) {
      case "1":
        if (nroDocumento.length === 8) {
          getInfoByNroDni();
        }
        break;
      case "2":
        if (nroDocumento.length === 11) {
        }
        break;

      default:
        break;
    }
  }, [watch("nro_documento")]);

  return {
    register,
    handleSubmit,
    errors,
    setError,
    onSubmit,
    setValue,
    watch,
    loading,
    state,
    loadingInfo,
  };
};

export default useFormCreateClient;
