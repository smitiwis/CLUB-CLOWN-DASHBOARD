"use server";

import { IStateCliente } from "@/lib/clients/definitions";
import { IFormClientCall } from "../definitions";
import { getUserId } from "@/lib/helpers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createClientLlamada(
  prevState: IStateCliente,
  formData: IFormClientCall
) {
  try {
    // Validate form using Zod

    // VALIDAR SI EXISTE EL USERID
    const userId = await getUserId();
    if (!userId) return null;

    // Create the client llamada
    console.log("formData", formData);
    const clienteLlamada = await prisma.cliente_llamada.create({
      data: {
        id_cliente: formData.id_cliente,
        id_usuario: userId,
        estado: formData.estado,
        observacion: formData.observacion || "",
        tipo: formData.tipo,
        resultado: formData.resultado,
      },
    });

    if (!clienteLlamada) {
      throw { message: "Error al crear la llamada" };
    }
    // ACTUALIZAR EL ESTADO DEL CLIENTE
    await prisma.cliente.update({
      where: { id_cliente: formData.id_cliente },
      data: {
        estado: formData.estado,
        fecha_agendada: formData.fecha_agendada,
      },
    });

    console.log("clienteLlamada", clienteLlamada);
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    } else if (typeof error === "object") {
      return error;
    } else {
      return { message: "Error desconocido" };
    }
  }

  // Revalidate the cache for the invoices Page and redirect the user.
  revalidatePath("/dashboard/llamadas");
  redirect("/dashboard/llamadas");
}
