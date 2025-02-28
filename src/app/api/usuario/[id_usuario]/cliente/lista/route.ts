import { formatearNombre, getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { format } from "@formkit/tempo";
import { NextRequest } from "next/server";

type params = {
  params: Promise<{ id_usuario: string }>;
};

export async function GET(request: NextRequest, { params }: params) {
  try {
    const id_usuario = (await params).id_usuario || (await getUserId());

    if (!id_usuario) {
      return Response.json(
        { mensaje: "ID de cliente inválido" },
        { status: 400 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const phoneNumber = (searchParams.get("phoneNumber") || "")
      .replace(/\s+/g, "")
      .trim(); // Número de celular (opcional)
    const status = searchParams.get("status") || ""; // Estado (opcional)
    const categoria = searchParams.get("categoria") || ""; // Categoría (opcional)

    const where: {
      id_usuario: string;
      telefono?: { contains: string };
      estado?: string;
      categoria?: string;
    } = { id_usuario };

    if (phoneNumber) {
      where.telefono = { contains: phoneNumber }; // Filtra por número parcial o completo
    }

    if (categoria) {
      where.categoria = categoria;
    }

    if (status) {
      where.estado = status;
    }

    // Calcular la paginación
    const skip = (page - 1) * limit;
    const take = limit;

    const total = await prisma.cliente.count({
      where: {
        ...where,
        id_usuario: id_usuario !== "all" ? id_usuario : undefined,
      },
    });
    const clientes = await prisma.cliente.findMany({
      where: {
        ...where,
        id_usuario: id_usuario !== "all" ? id_usuario : undefined,
      },
      skip,
      take,
      orderBy: { fecha_creacion: "desc" },
      select: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
          },
        },
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
        categoria: true,
        origen: true,
        fecha_creacion: true,
        cliente_llamada: {
          select: {
            fecha_creacion: true,
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

      const calls = cliente.cliente_llamada;
      const nro_llamadas = calls.length;
      const lastCall = calls[nro_llamadas - 1];
      const callDate = lastCall
        ? new Date(lastCall.fecha_creacion)
        : "2000-01-22T22:12:16.157Z";
      const currentDate = new Date();

      const formattedCallDate = format(callDate, "YYYY-MM-DD");
      const formattedCurrentDate = format(currentDate, "YYYY-MM-DD");

      const isCallToday = formattedCallDate === formattedCurrentDate;

      return {
        ...cliente,
        llamada: getPendingCall
          ? getPendingCall
          : cliente.cliente_llamada.find((call) => call.estado_agenda) || null,
        nro_llamadas,
        isCallToday,
        usuario: {
          id_usuario: cliente.usuario.id_usuario,
          nombre: formatearNombre(
            `${cliente.usuario.nombre} ${cliente.usuario.apellido}`,
            20
          ),
        },
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
