import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const phoneNumber = searchParams.get("phoneNumber") || ""; // Número de celular (opcional)
    const status = searchParams.get("status") || ""; // Estado (opcional)

    const id_usuario = await getUserId();
    if (!id_usuario) {
      return Response.json({ mensaje: "Usuario desconocido" }, { status: 401 });
    }
    const where: {
      id_usuario: string;
      telefono?: { contains: string };
      estado?: string;
    } = { id_usuario };

    if (phoneNumber) {
      where.telefono = { contains: phoneNumber }; // Filtra por número parcial o completo
    }

    if (status) {
      where.estado = status; // Filtra por estado exacto
    }

    // Calcular la paginación
    const skip = (page - 1) * limit;
    const take = limit;

    const total = await prisma.cliente.count({ where });
    const clientes = await prisma.cliente.findMany({
      where,
      skip,
      take,
      select: {
        id_cliente: true,
        telefono: true,
        nombre_apo: true,
        nombre: true,
        apellido: true,
        edad: true,
        grupo: true,
        estado: true,
        tipo_documento: true,
        nro_documento: true,
        direccion: true,
        nro_direccion: true,
        origen: true,
        cliente_llamada: {
          select: {
            id_cliente_llamada: true,
            estado_agenda: true,
            fecha_agendada: true,
          },
        },
      },
    });

    if (!clientes) {
      throw new Error("No se encontraron leads.");
    }

    const totalPages = Math.ceil(total / limit);

    const clientesList = clientes.map((cliente) => {
      const getPendingCall = cliente.cliente_llamada.find(
        (call) => call.estado_agenda === "1" && call.fecha_agendada
      );

      return {
        ...cliente,
        llamada: getPendingCall
          ? getPendingCall
          : cliente.cliente_llamada.find((call) => call.estado_agenda) || null,
        nro_llamadas: cliente.cliente_llamada.length,
      };
    }); // Aquí se puede mapear los datos

    return Response.json(
      {
        data: clientesList,
        pagination: {
          total,
          totalPages,
          page,
          limit,
        }
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
