/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  IF_Inscripcion,
  IF_InscripcionReq,
  IStateInscription,
  schemaInscripcion,
} from "../schemas";
import { useActionState, useEffect, useState, useTransition } from "react";
import { IBClientOptions } from "@/lib/clients/definitions";
import { IBTalleresOptions } from "@/lib/talleres/definicions";
import { IBPromoOptions } from "@/lib/promociones/definitions";
import { crearInscripcion } from "@/lib/inscripciones/actions";
import { REGEX } from "@/constants/regex";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { IUploadResult } from "../definitions";

const useFormInscribirCliente = () => {
  const [loadingForm, startTransaction] = useTransition();
  const [loading, setLoading] = useState(loadingForm);
  const [fileBaucher, setFileBaucher] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState("");

  const [state, formAction] = useActionState<
    IStateInscription,
    IF_InscripcionReq
  >(crearInscripcion, null);

  const [selectedIdClient, setSelectedIdClient] = useState<IBClientOptions>();
  const [selectedTaller, setSelectedTaller] = useState<IBTalleresOptions>();
  const [selectedPromocion, setSelectedPromocion] = useState<IBPromoOptions>();
  const [stateForm, setStateForm] = useState<IStateInscription>(state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<IF_Inscripcion>({
    defaultValues: {
      baucher: "",
      estado_inscripcion: "sin_pago",
    },
    resolver: yupResolver<IF_Inscripcion>(schemaInscripcion),
  });

  const onSubmit = async (formData: IF_Inscripcion) => {
    // SI TODOS LOS CAMPOS ESTAN BIEN ENTONCES SUBIMOS LA IMAGE
    let uploadResult: IUploadResult | null = null;
    try {
      if (fileBaucher) {
        setLoading(true);
        const formDataFile = new FormData();

        const options = {
          maxSizeMB: 1, // Tamaño máximo en MB
          maxWidthOrHeight: 800, // Redimensionar la imagen
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(fileBaucher, options);
        formDataFile.append("file", compressedFile);

        const response = await axios.post("/api/images/upload", formDataFile, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          uploadResult = response.data.imageData;
          const { monto, metodo_pago, baucher, nro_transaccion } = formData;
          if (selectedIdClient && selectedTaller && selectedPromocion) {
            // Extraemos la parte que sigue después de "/upload/"
            const urlImage = response.data.imageData.url;
            const uploadIndex = urlImage.indexOf("upload") + "upload".length;
            const imagePath = urlImage.slice(uploadIndex);

            const body = {
              id_cliente: selectedIdClient.id_cliente,
              id_taller: selectedTaller.id_taller,
              id_taller_promocion: selectedPromocion.id_taller_promocion,
              precio_venta: formData.precio_venta,
              observacion: formData.observacion,
              pago:
                monto && metodo_pago && baucher && nro_transaccion
                  ? {
                      estado: formData.estado_inscripcion,
                      monto: monto,
                      metodo_pago: metodo_pago,
                      baucher: imagePath,
                      nro_transaccion: nro_transaccion,
                    }
                  : null,
            };

            startTransaction(() => formAction(body));
          }
        }
      }
    } catch (error) {
      // Revertir la subida de la imagen en caso falle algo
      console.error("error", error);
      if (uploadResult && uploadResult.public_id) {
        await axios.post(
          "/api/images/destroy",
          { public_id: uploadResult.public_id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTaller) {
      clearErrors("id_taller");
      clearErrors("precio_venta");
      if (selectedPromocion) {
        const precioTaller = selectedTaller.precio;
        const descuento = selectedPromocion.descuento;
        const precioVenta = precioTaller - descuento;

        setValue("precio_venta", precioVenta.toFixed(2));
        clearErrors("id_taller_promocion");
      } else {
        const precioVenta = selectedTaller.precio;
        setValue("precio_venta", precioVenta.toFixed(2));
      }
    } else {
      setValue("precio_venta", "");
    }
  }, [selectedTaller, selectedPromocion]);

  useEffect(() => {
    const precio = watch("precio_venta");
    if (precio) {
      clearErrors("precio_venta");
    }
  }, [watch("precio_venta")]);

  useEffect(() => {
    const idCliente = watch("id_cliente");
    setStateForm(null);
    if (idCliente) {
      clearErrors("id_cliente");
    }
  }, [watch("id_cliente")]);

  useEffect(() => {
    const getMonto = watch("monto");
    let message = "";

    if (getMonto && !REGEX.NUMERIC.test(getMonto)) {
      message = "El monto debe ser un numero";
      return setError("monto", { message });
    }
    const montoPago = parseFloat(watch("monto") || "0");
    const precioVenta = parseFloat(watch("precio_venta"));

    if (montoPago) {
      if (montoPago < 0) {
        message = "El monto debe ser positivo";
        return setError("monto", { message });
      }

      if (montoPago < 25) {
        message = "El monto debe ser como mínimo S/25.00";
        return setError("monto", { message });
      }
    }

    if (precioVenta) {
      if (montoPago > precioVenta) {
        message = "El monto no debe ser mayor al precio de venta";
        return setError("monto", { message });
      }

      clearErrors("monto");
      if (montoPago === 0) {
        setValue("estado_inscripcion", "sin_pago");
      }
      if (montoPago > 0 && montoPago < precioVenta) {
        setValue("estado_inscripcion", "pago_pend");
      }
      console.log(montoPago, precioVenta);
      if (montoPago === precioVenta) {
        setValue("estado_inscripcion", "pago_compl");
      }
    }
  }, [watch("monto")]);

  useEffect(() => {
    if (state) {
      setStateForm(state);
    }
  }, [state]);

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
    stateForm,
    selectedIdClient,
    setSelectedIdClient,
    selectedTaller,
    setSelectedTaller,
    selectedPromocion,
    setSelectedPromocion,
    setFileBaucher,
    setPreviewUrl,
    previewUrl,
  };
};

export default useFormInscribirCliente;
