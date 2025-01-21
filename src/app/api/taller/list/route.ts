import { fetchTalleres } from "@/lib/talleres/services";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const tallerList = await fetchTalleres({ page, limit });

    return Response.json(tallerList, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return Response.json(
      { mensaje: "Error al obtener datos de leads" },
      { status: 500 }
    );
  }
}
