import { sql } from "@vercel/postgres";
import { prisma } from "@/lib/prisma";
import { IBClientRes, IClientRes } from "../definitions";
import { getUserId } from "@/lib/helpers";

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<IClientRes>`
      SELECT * FROM leads
      WHERE leads.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: 22,
    }));

    // console.log(invoice); // Invoice is an empty array []
    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchClients() {
  try {
    const userId = await getUserId();
    if (!userId) return new Error("Usuario desconocido");

    const clientes: IBClientRes[] = await prisma.cliente.findMany({
      where: {
        id_usuario: userId,
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

    return clientes;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener leads .");
  }
}
