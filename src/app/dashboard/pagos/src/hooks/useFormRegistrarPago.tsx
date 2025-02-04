/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { IF_pago, IStatePago, schemaPago } from "../schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useActionState, useEffect, useState, useTransition } from "react";
import { registrarPago } from "@/lib/pagos/actions.ts";
import { IBInscritosOptions } from "../definitions";

const useFormRegistrarPago = (inscritosOptions: IBInscritosOptions[]) => {
  const [clientSelected, setClientSelected] = useState<IBInscritosOptions>();
  const [loading, startTransaction] = useTransition();

  const [state, formAction] = useActionState<IStatePago, IF_pago>(
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

  const onSubmit = (formData: IF_pago) => {
    startTransaction(() => formAction(formData));
  };

  const validateMonto = (monto: number, saldoPend: number) => {
    if (monto && saldoPend) {
      if (monto > saldoPend) {
        const message = "El monto ingresado debe ser menor o igual al saldo pendiente";
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
  };
};

export default useFormRegistrarPago;
