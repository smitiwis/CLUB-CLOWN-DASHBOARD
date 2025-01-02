"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IFClient, IStateLead } from "../definitions";
import { prisma } from "@/lib/prisma";

export async function createLead(prevState: IStateLead, formData: IFClient) {
  // Validate form using Zod
  try {
    // VALIDAR SI EL TELEFONO YA EXISTE
    // VALIDAR POR TELEFONO
    const existingUserPhone = await prisma.cliente.findUnique({
      where: { telefono: formData.telefono },
    });

    if (existingUserPhone) {
      throw {
        message: "El teléfono ya está registrado.",
        status: 400,
        field: "telefono",
      };
    }
    
    // CREAR CLIENTE
    await prisma.cliente.create({
      data: {
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
