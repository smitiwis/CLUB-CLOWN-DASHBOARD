"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IClientReq, IFClient, IStateCliente } from "../definitions";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/helpers";

export async function createClient(
  prevState: IStateCliente,
  formData: IFClient
) {
  try {
    // Validate form using Zod

    // VALIDAR SI EXISTE EL USERID
    const userId = await getUserId();
    if (!userId) return null;

    // VALIDAR SI EL TELEFONO YA EXISTE
    const existingUserPhone = await prisma.cliente.findUnique({
      where: { telefono: formData.telefono },
    });

    if (existingUserPhone) {
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: existingUserPhone.id_usuario },
      });
      throw {
        message: `El teléfono ya está registrado por el ascesor ${usuario?.nombre}`,
        status: 400,
        field: "telefono",
      };
    }

    // CREAR CLIENTE
    await prisma.cliente.create({
      data: {
        id_usuario: userId,
        telefono: formData.telefono,
        tipo_documento: formData.tipo_documento,
        nro_documento: formData.nro_documento,
        nombre_apo: formData.nombre_apo,
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: formData.edad,
        direccion: formData.direccion,
        nro_direccion: formData.nro_direccion,
        origen: formData.origen,
        grupo: formData.grupo,
        estado: formData.estado,
      },
    });
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
  revalidatePath("/dashboard/leads");
  redirect("/dashboard/leads");
}

export async function editClient(
  prevState: IStateCliente,
  formData: IClientReq
) {
  try {
    // Validate form using Zod

    // VALIDAR SI EXISTE EL USUARIO
    const userId = await getUserId();
    if (!userId) return null;

    // ACTUALIZAR CLIENTE
    const updateClient = await prisma.cliente.update({
      where: { id_cliente: formData.id_cliente },
      data: {
        telefono: formData.telefono,
        nombre_apo: formData.nombre_apo,
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: formData.edad,
        grupo: formData.grupo,
        estado: formData.estado,
      },
      select: {
        id_cliente: true,
        telefono: true,
        nombre_apo: true,
        nombre: true,
        apellido: true,
        edad: true,
        grupo: true,
        estado: true,
      },
    });

    if (!updateClient) return { message: "No se pudo actualizar el cliente" };

    if (!formData.redirect) {
      return { client: updateClient };
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

  revalidatePath("/dashboard/leads");
  redirect("/dashboard/leads");
}

type IUpdateRecontact = {
  id_cliente: string;
  fecha_agendada: string;
};

export async function addRecordClient(
  prevState: IStateCliente,
  formData: IUpdateRecontact
) {
  try {
    // Validate form using Zod

    // VALIDAR SI EXISTE EL USUARIO
    const userId = await getUserId();
    if (!userId) return null;

    await prisma.cliente.update({
      where: { id_cliente: formData.id_cliente },
      data: {
        fecha_agendada: formData.fecha_agendada,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    } else if (typeof error === "object") {
      return error;
    } else {
      return { message: "Error desconocido" };
    }
  }
}
