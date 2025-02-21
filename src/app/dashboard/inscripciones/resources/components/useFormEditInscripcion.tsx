/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  IF_EditInscripcionReq,
  IStateEditInscription,
  schemaEditInscripcion,
} from "../schemas/editInscripcion";
import { IEditInscripcion, IFormEditInscripcion } from "../definitions";
import { IBClientOptions } from "@/lib/clients/definitions";
import { useActionState, useEffect, useState, useTransition } from "react";
import { IBPromoOptions } from "@/lib/promociones/definitions";
import { IBTalleresOptions } from "@/lib/talleres/definicions";
import { editInscripcion } from "@/lib/inscripciones/actions";

const useFormEditInscripcion = (inscripcion: IEditInscripcion) => {
  const [selectedIdClient, setSelectedIdClient] = useState<IBClientOptions>();
  const [selectedPromocion, setSelectedPromocion] = useState<IBPromoOptions>();
  const [selectedTaller, setSelectedTaller] = useState<IBTalleresOptions>();

  const [loadingForm, startTransaction] = useTransition();

  const [stateForm, formAction] = useActionState<
    IStateEditInscription,
    IF_EditInscripcionReq
  >(editInscripcion, null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<IFormEditInscripcion>({
    defaultValues: {
      id_inscripcion: inscripcion.id_taller_cliente,
      id_cliente: inscripcion.id_cliente,
      id_usuario: inscripcion.id_usuario,
      id_taller: inscripcion.id_taller,
      id_taller_promocion: inscripcion.id_taller_promocion,
      estado: inscripcion.estado,
      precio_venta: inscripcion.precio_venta.toString(),
      observacion: inscripcion.observacion,
    },
    resolver: yupResolver<IFormEditInscripcion>(schemaEditInscripcion),
  });

  const onSubmit = async (formData: IFormEditInscripcion) => {
    const body = { ...formData, id_cliente: selectedIdClient!.id_cliente };
    startTransaction(() => formAction(body));
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

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
    watch,
    loadingForm,
    stateForm,

    selectedIdClient,
    setSelectedIdClient,
    selectedTaller,
    setSelectedTaller,
    selectedPromocion,
    setSelectedPromocion,
    // setFileBaucher,
    // setPreviewUrl,
    // previewUrl,
  };
};

export default useFormEditInscripcion;
