import { sql } from "@vercel/postgres";
import { ILead } from "../definitions/definitions";

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<ILead>`
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

export async function fetchLeads() {
  try {
    const data = await sql<ILead>`
      SELECT * FROM leads 
      ORDER BY nombre_contacto ASC
    `;

    const leads = data.rows;
    console.log(leads);
    return leads;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener leads .");
  }
}
