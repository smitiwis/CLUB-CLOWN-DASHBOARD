"use server";

import { getUserId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  IF_InscripcionReq,
  IStateInscription,
} from "@/app/dashboard/inscripciones/resources/schemas";

export async function crearInscripcion(
  prevState: IStateInscription,
  formData: IF_InscripcionReq
) {
  try {
    console.log("DATA: ", formData);
    // Validate form using Zod

    // VALIDAR SI EXISTE EL USERID
    const userId = await getUserId();
    if (!userId) return null;

    const estadoPago = formData.pago ? formData.pago.estado : "sin_pago";
    // Crear la inscripcion
    const inscripcion = await prisma.taller_cliente.create({
      data: {
        id_cliente: formData.id_cliente,
        id_taller: formData.id_taller,
        id_taller_promocion: formData.id_taller_promocion,
        estado_pago: estadoPago,
        precio_venta: parseFloat(formData.precio_venta),
      },
    });
    console.log("=========" ,inscripcion);

    if (inscripcion) {
      // actualizar estado del cliente
      await prisma.cliente.update({
        where: { id_cliente: formData.id_cliente },
        data: {
          estado:
            formData.pago && parseInt(formData.pago.monto) > 25 ? "6" : "7",
        },
      });

      if (formData.pago) {
        // Crear el pago
        const { monto, metodo_pago, baucher } = formData.pago;

        await prisma.taller_cliente_pagos.create({
          data: {
            id_taller_cliente: inscripcion.id_taller_cliente,
            monto: parseFloat(monto),
            metodo_pago: metodo_pago,
            img_boucher: baucher,
            fecha_pago: new Date(),
          },
        });
      }
    }

  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return { message: error.message };
    } else if (typeof error === "object") {
      return error;
    } else {
      return { message: "Error desconocido" };
    }
  }

  // Revalidate the cache for the invoices Page and redirect the user.
  revalidatePath("/dashboard/inscripciones");
  redirect("/dashboard/inscripciones");
}
