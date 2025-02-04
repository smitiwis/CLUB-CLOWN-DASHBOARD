import { getUserId } from "@/lib/helpers";
import { fetchInscripciones } from "@/lib/inscripciones/services";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get("phoneNumber") || ""; // Número de celular (opcional)

    // PAGINATION
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const id_usuario = await getUserId();
    if (!id_usuario) {
      return Response.json({ mensaje: "Usuario desconocido" }, { status: 401 });
    }

    // Calcular la paginación
    const paginate = { page, limit };

    const inscritosResp = await fetchInscripciones(paginate, phoneNumber);;

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
