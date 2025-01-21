"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/helpers";
import { IBFormTaller, IStateTaller } from "../definicions";

export async function createTaller(
  prevState: IStateTaller,
  formData: IBFormTaller
) {
  try {
    // Validate form using Zod
    // VALIDAR SI EXISTE EL USERID
    const userId = await getUserId();
    if (!userId) return null;

    // Crear el taller
    const newTaller = await prisma.taller.create({ data: formData });

    if (!newTaller) {
      throw { message: "Error al crear el Taller" };
    }
    console.log("formData", formData);
  } catch (error) {
    console.error("error", error);
    if (error instanceof Error) {
      return { message: error.message };
    } else if (typeof error === "object") {
      return error;
    } else {
      return { message: "Error desconocido" };
    }
  }

  // Revalidate the cache for the invoices Page and redirect the user.
  revalidatePath("/dashboard/talleres");
  redirect("/dashboard/talleres");
}
