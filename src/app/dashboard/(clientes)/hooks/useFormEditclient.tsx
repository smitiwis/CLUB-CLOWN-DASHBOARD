/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaClient } from "@/lib/clients/schemas";
import {
  IClientReq,
  IClientRes,
  IFClient,
  IGruposClients,
  IStateUpdateClient,
} from "@/lib/clients/definitions";
import { editClient } from "@/lib/clients/actions/action";
import axios from "axios";

const useFormEditClient = (client: IClientRes, redirect: boolean) => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [hasDataByDocument, setHasDataByDocument] = useState(false);
  const [loadingInfo, setLoadigInfo] = useState(false);
  const [loading, startTransaction] = useTransition();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [state, formAction] = useActionState<IStateUpdateClient, IClientReq>(
    editClient,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
    reset,
    clearErrors,
  } = useForm<IFClient>({
    defaultValues: {
      fecha_agendada: undefined,
      nro_documento:""
    },
    resolver: yupResolver<IFClient>(schemaClient),
  });

  const onSubmit = (formData: IFClient) => {
    const data = { ...formData, id_cliente: client.id_cliente, redirect };
    console.log("formData", data);
    startTransaction(() => formAction(data));
  };

  const getInfoByNroDni = async () => {
    const API = `/api/document/dni/${watch("nro_documento")}`;
    try {
      setLoadigInfo(true);
      const response = await axios.get(API);

      if (response.status === 200) {
        setHasDataByDocument(true);
        const { data } = response;
        clearErrors("nro_documento");
        setValue("nombre", data.nombres);
        setValue("apellido", `${data.apellidoPaterno} ${data.apellidoMaterno}`);
      }
    } catch (error) {
      setHasDataByDocument(false);
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
    setValue("nombre", "");
    setValue("apellido", "");
    setValue("nro_documento", "");
    setHasDataByDocument(false);

    if (!tipoDocumento) {
      clearErrors("nro_documento")
    };
  }, [watch("tipo_documento")]);

  useEffect(() => {
    const tipoDocumento = watch("tipo_documento");
    const nroDocumento = watch("nro_documento");
    if (!nroDocumento) {
      setValue("nombre", "");
      setValue("apellido", "");
    }

    if (tipoDocumento) {
      if (client.nro_documento !== nroDocumento) {
        switch (tipoDocumento) {
          case "1":
            if (nroDocumento.length === 8) {
              if (documentNumber === nroDocumento) return
              setDocumentNumber(nroDocumento);
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
      } else {
        setValue("nombre", client.nombre);
        setValue("apellido", client.apellido);
      }
    }
    if (isFirstRender) setIsFirstRender(false);
  }, [watch("nro_documento")]);

  useEffect(() => {
    console.log("client", client);
    reset(client);
  }, []);

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
    hasDataByDocument
  };
};

export default useFormEditClient;
