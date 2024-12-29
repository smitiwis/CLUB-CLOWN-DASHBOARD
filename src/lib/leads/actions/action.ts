"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ILeadForm, IStateLead } from "../definitions";
import { sql } from "@vercel/postgres";

export async function createLead(prevState: IStateLead, formData: ILeadForm) {
  // Validate form using Zod
  console.log("formData BDDD", formData);

  // Prepare data for insertion into the database

  // Insert data into the database
  try {
    await sql`
    INSERT INTO leads (
      celular_contacto,
      nombre_contacto,
      edad_contacto,
      color,
      categoria_contacto,
      grupo_horario,
      fecha_inicio_taller
    ) VALUES (
      ${formData.celular_contacto},
      ${formData.nombre_contacto},
      ${formData.edad_contacto},
      ${formData.color},
      ${formData.categoria_contacto},
      ${formData.grupo_horario},
      ${formData.fecha_inicio_taller}
    )
  `;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Lead.",
    };
  }

  // Revalidate the cache for the invoices Page and redirect the user.
  revalidatePath("/dashboard/leads");
  redirect("/dashboard/leads");
}
