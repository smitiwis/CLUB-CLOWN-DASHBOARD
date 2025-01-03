"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IFClient, IStateCliente } from "../definitions";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/helpers";

export async function createClient(prevState: IStateCliente, formData: IFClient) {
  try {
    // Validate form using Zod

    // VALIDAR SI EXISTE EL USERID
    const userId = await getUserId();
    console.log("USER ====== : ", userId);
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
        nombre_apo: formData.nombre_apo,
        nombre: formData.nombre,
        apellido: formData.apellido,
        edad: formData.edad,
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
