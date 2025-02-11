/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { IF_pago, IF_pagoReq, IStatePago, schemaPago } from "../schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useActionState, useEffect, useState, useTransition } from "react";
import { registrarPago } from "@/lib/pagos/actions.ts";
import { IBInscritosOptions } from "../definitions";
import imageCompression from "browser-image-compression";


const useFormRegistrarPago = (inscritosOptions: IBInscritosOptions[]) => {
  const [clientSelected, setClientSelected] = useState<IBInscritosOptions>();
  const [loading, startTransaction] = useTransition();
  const [fileBaucher, setFileBaucher] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState("");

  const [state, formAction] = useActionState<IStatePago, IF_pagoReq>(
    registrarPago,
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
  } = useForm<IF_pago>({
    defaultValues: {
      baucher: "",
    },
    resolver: yupResolver<IF_pago>(schemaPago),
  });

  const onSubmit = async(formData: IF_pago) => {
    if (fileBaucher) {
      const formDataFile = new FormData();

      const options = {
        maxSizeMB: 1, // Tamaño máximo en MB
        maxWidthOrHeight: 800, // Redimensionar la imagen
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(fileBaucher, options);
      formDataFile.append("file", compressedFile);

      const body = {
        ...formData,
        baucher: formDataFile,
      };
      startTransaction(() => formAction(body));
    }
  };

  const validateMonto = (monto: number, saldoPend: number) => {
    if (monto && saldoPend) {
      if (monto > saldoPend) {
        const message =
          "El monto ingresado debe ser menor o igual al saldo pendiente";
        setError("monto", { message });
      } else {
        clearErrors("monto");
      }
    }
  };

  useEffect(() => {
    const idTallerCliente = watch("id_taller_cliente");
    if (idTallerCliente) {
      const cliente = inscritosOptions.find(
        (inscrito) => inscrito.id_cliente === idTallerCliente
      );
      setClientSelected(cliente);
      const parseMonto = parseFloat(watch("monto"));
      validateMonto(parseMonto, cliente?.saldoPendiente || 0);
    }
  }, [watch("id_taller_cliente")]);

  useEffect(() => {
    const monto = watch("monto");

    if (monto && clientSelected) {
      const parseMonto = parseFloat(monto);
      const saldoPendiente = clientSelected.saldoPendiente;
      validateMonto(parseMonto, saldoPendiente);
    }
  }, [watch("monto")]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
    watch,
    loading,
    state,
    clientSelected,
    setPreviewUrl,
    previewUrl,
    setFileBaucher,
  };
};

export default useFormRegistrarPago;
