/* eslint-disable react-hooks/exhaustive-deps */
import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaUsuario } from "@/lib/usuarios/schemas";
import { createUsuario } from "@/lib/usuarios/actions";
import { IStateUsuario, IUsuarioForm } from "@/lib/usuarios/definicions";
import axios from "axios";

const useFormCreateUser = () => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [hasDataByDocument, setHasDataByDocument] = useState(false);
  const [loadingInfo, setLoadigInfo] = useState(false);

  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateUsuario, IUsuarioForm>(
    createUsuario,
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
    watch
  } = useForm({
    resolver: yupResolver<IUsuarioForm>(schemaUsuario),
  });

  const onSubmit = (formData: IUsuarioForm) => {
    startTransaction(() => formAction(formData));
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
        setValue("apellido", data.apellidoPaterno + " " + data.apellidoMaterno);
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
    const tipoDocumento = watch("tipo_documento");
    const nroDocumento = watch("nro_documento");
    if (!nroDocumento) {
      setValue("nombre", "");
      setValue("apellido", "");
    }

    switch (tipoDocumento) {
      case "1":
        if (nroDocumento.length === 8) {
          if (documentNumber === nroDocumento) return;
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
  }, [watch("nro_documento")]);


  useEffect(() => {
    setValue("nombre", "");
    setValue("apellido", "");
    setValue("nro_documento", "");

    setHasDataByDocument(false);
    setDocumentNumber("");

    clearErrors("nro_documento");
  }, [watch("tipo_documento")]);

  return {
    register,
    handleSubmit,
    errors,
    setError,
    watch,
    onSubmit,

    hasDataByDocument,
    loadingInfo,
    loading, // LO QUE DEMORA EN CREAR EL USUARIO
    state, // ESTADO DE LA TRANSACCION O CREACION DEL USUARIO
  };
};

export default useFormCreateUser;
