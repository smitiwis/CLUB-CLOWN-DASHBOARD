import { fetchInscripciones } from "@/lib/inscripciones/services";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get("phoneNumber") || ""; // Número de celular (opcional)
    const categoria = searchParams.get("categoria") || ""; // Categoría (opcional)

    // PAGINATION
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const id_usuario = searchParams.get("id_usuario") || "all";

    // Calcular la paginación
    const paginate = { page, limit };
    const filter = { phoneNumber, id_usuario, categoria };

    const inscritosResp = await fetchInscripciones(paginate, filter);;

    if (inscritosResp instanceof Error) {
      throw new Error("No se encontraron inscritos.");
    }

    return Response.json(inscritosResp, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return Response.json(
      { mensaje: "Error al obtener inscritos" },
      { status: 500 }
    );
  }
}
