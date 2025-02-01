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

const useFormInscribirCliente = () => {
  const [loading, startTransaction] = useTransition();

  const [state, formAction] = useActionState<
    IStateInscription,
    IF_InscripcionReq
  >(crearInscripcion, null);

  const [selectedIdClient, setSelectedIdClient] = useState<IBClientOptions>();
  const [selectedTaller, setSelectedTaller] = useState<IBTalleresOptions>();
  const [selectedPromocion, setSelectedPromocion] = useState<IBPromoOptions>();

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

  const onSubmit = (formData: IF_Inscripcion) => {
    const { monto, metodo_pago, baucher } = formData;
    if (selectedIdClient && selectedTaller && selectedPromocion) {
      const body = {
        id_cliente: selectedIdClient.id_cliente,
        id_taller: selectedTaller.id_taller,
        id_taller_promocion: selectedPromocion.id_taller_promocion,
        precio_venta: formData.precio_venta,
        pago:
          monto && metodo_pago && baucher
            ? {
                monto: monto,
                metodo_pago: metodo_pago,
                baucher: baucher,
                estado: formData.estado_inscripcion,
              }
            : null,
      };
      console.log("BODY: ", body);
      startTransaction(() => formAction(body));
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
    if (idCliente) {
      clearErrors("id_cliente");
    }
  }, [watch("id_cliente")]);

  useEffect(() => {
    const montoPago = parseFloat(watch("monto") || "0");
    const precioVenta = parseFloat(watch("precio_venta"));
    console.log("montoPago", montoPago);
    console.log("precioVenta", precioVenta);
    let message = "";

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

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    clearErrors,
    setValue,
    watch,
    loading,
    state,
    selectedIdClient,
    setSelectedIdClient,
    selectedTaller,
    setSelectedTaller,
    selectedPromocion,
    setSelectedPromocion,
  };
};

export default useFormInscribirCliente;
