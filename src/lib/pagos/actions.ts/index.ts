"use server";

import { getUserId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { IF_pago, IStatePago } from "@/app/dashboard/pagos/src/schemas";

export async function registrarPago(
  prevState: IStatePago,
  formData: IF_pago
) {
  try {
    // Validar si existe el userId
    const userId = await getUserId();
    if (!userId) return null;

    const { id_taller_cliente, monto, metodo_pago, baucher, nro_transaccion } = formData;

    // Obtener la inscripción del cliente al taller, incluyendo el precio de venta y los pagos realizados
    const inscripcion = await prisma.taller_cliente.findUnique({
      where: { id_taller_cliente },
      include: {
        taller_cliente_pagos: {
          select: { monto: true },
        },
      },
    });

    if (!inscripcion) {
      throw new Error("Inscripción no encontrada.");
    }

    const precioVenta = inscripcion.precio_venta;

    // Calcular el total pagado hasta la fecha
    const totalPagado = inscripcion.taller_cliente_pagos.reduce((acc, pago) => acc + pago.monto, 0);

    // Calcular el saldo pendiente
    const saldoPendiente = precioVenta - totalPagado;

    // Validar que el nuevo pago no exceda el saldo pendiente
    const nuevoMonto = parseFloat(monto);
    if (nuevoMonto > saldoPendiente) {
      throw {
        message: `El monto ingresado debe ser menor o igual al S/${saldoPendiente.toFixed(2)}.`,
        status: 400,
        field: "monto",
      };
    }

    // Iniciar una transacción para asegurar la consistencia de los datos
    await prisma.$transaction(async (prisma) => {
      // Crear el nuevo pago
      await prisma.taller_cliente_pagos.create({
        data: {
          id_taller_cliente,
          monto: nuevoMonto,
          metodo_pago,
          img_boucher: baucher,
          nro_transaccion,
          fecha_pago: new Date(),
        },
      });

      // Si el saldo pendiente después del nuevo pago es cero, actualizar el estado de pago de la inscripción
      if (nuevoMonto === saldoPendiente) {
        await prisma.taller_cliente.update({
          where: { id_taller_cliente },
          data: { estado_pago: "pago_compl" },
        });
      }
    });

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

  // Revalidar la caché para la página de pagos y redirigir al usuario.
  revalidatePath("/dashboard/pagos");
  redirect("/dashboard/pagos");
}
