import { fetchClients } from "@/lib/clients/services";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const pagination = { page, limit };

    const clientsList = await fetchClients(pagination);
    return Response.json({ mensaje: "Datos de leads obtenidos", clientsList }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return Response.json({ mensaje: "Error al obtener datos de leads" }, { status: 500 });
  }
}
