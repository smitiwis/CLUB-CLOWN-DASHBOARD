import { getUserId } from "@/lib/helpers";
import {
  IBClientCallRes,
  RESULTADO_CALL,
  TIPO_CALL,
} from "@/lib/llamadas/definitions";
import { prisma } from "@/lib/prisma";
import { format } from "@formkit/tempo";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const id_usuario = await getUserId();
    if (!id_usuario) {
      return Response.json({ mensaje: "Usuario desconocido" }, { status: 401 });
    }

    // Calcular la paginación
    const skip = (page - 1) * limit;
    const take = limit;

    const total = await prisma.cliente_llamada.count({ where: { id_usuario } });
    const llamadas = await prisma.cliente_llamada.findMany({
      where: { id_usuario },
      skip,
      take,
      orderBy: { fecha_creacion: "desc" },
      select: {
        id_cliente_llamada: true,
        estado: true,
        observacion: true,
        tipo: true,
        resultado: true,
        fecha_creacion: true,
        cliente: {
          select: {
            id_cliente: true,
            nombre: true,
            telefono: true,
          },
        },
      },
    });

    if (!llamadas) {
      throw new Error("No se encontraron leads.");
    }

    const callsList: IBClientCallRes[] = llamadas.map((llamada, i) => {
      return {
        ...llamada,
        key: i + 1,
        tipo: llamada.tipo as TIPO_CALL,
        resultado: llamada.resultado as RESULTADO_CALL,
        fecha_creacion: format(llamada.fecha_creacion, "D de MMM h:mm a"),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return Response.json(
      {
        data: callsList,
        pagination: {
          total,
          totalPages,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
    return Response.json(
      { mensaje: "Error al obtener datos de leads" },
      { status: 500 }
    );
  }
}
