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

    // OBTENENER TODAS LAS LLAMADAS
    const calls = await prisma.cliente_llamada.findMany({
      where: {
        id_usuario: userId,
        id_cliente: formData.id_cliente,
      },
      select: {
        id_usuario: true,
        id_cliente_llamada: true,
        fecha_agendada: true,
        estado_agenda: true,
      },
    });

    const hasAgenda =
      calls &&
      calls.find((call) => call.estado_agenda === "1" && call.fecha_agendada);

    // ACTUALIZAR ESTADO DE LA LLAMADA AGENDADA
    if (hasAgenda) {
      await prisma.cliente_llamada.update({
        where: { id_cliente_llamada: hasAgenda.id_cliente_llamada },
        data: { estado_agenda: "2", fecha_agendada: null },
      });
    }

    // Create the client llamada
    const data = {
      id_cliente: formData.id_cliente,
      id_usuario: userId,
      estado: formData.estado,
      observacion: formData.observacion || "",
      tipo: formData.tipo,
      resultado: formData.resultado,
      fecha_agendada: formData.fecha_agendada,
      estado_agenda: formData.fecha_agendada ? "1" : "",
    };

    const clienteLlamada = await prisma.cliente_llamada.create({ data });

    if (!clienteLlamada) {
      throw { message: "Error al crear la llamada" };
    }
    // ACTUALIZAR EL ESTADO DEL CLIENTE
    await prisma.cliente.update({
      where: { id_cliente: formData.id_cliente },
      data: { estado: formData.estado },
    });

    if (clienteLlamada) {
      throw {
        message: "Llamada creada con éxito",
        status: 200,
      }
    }

    

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
