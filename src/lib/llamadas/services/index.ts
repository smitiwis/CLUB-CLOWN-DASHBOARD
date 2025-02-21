import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { format } from "@formkit/tempo";
import { IBClientCallRes, RESULTADO_CALL, TIPO_CALL } from "../definitions";
import { IPagination } from "@/lib/definitions";

export async function fetchLlamadas(pagination: IPagination) {
  const { page, limit } = pagination;

  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

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

    const callsList: IBClientCallRes[] = llamadas.map((llamada, i) => {
      return {
        ...llamada,
        key: i + 1,
        tipo: llamada.tipo as TIPO_CALL,
        resultado: llamada.resultado as RESULTADO_CALL,
        fecha_creacion: format(llamada.fecha_creacion, "dddd D MMM, h:mm A", "es"),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: callsList,
      pagination: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener leads .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchStateCalls() {
  const id_usuario = await getUserId();
  if (!id_usuario) return null;

  const hoy = new Date();
  const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

  // Obtener el total de llamadas y las de hoy
  const [totalLlamadas, llamadasHoy] = await Promise.all([
    prisma.cliente_llamada.count({
      where: {
        id_usuario,
      },
    }),
    prisma.cliente_llamada.count({
      where: {
        id_usuario,
        fecha_creacion: {
          gte: inicioDia,
          lt: finDia,
        },
      },
    }),
  ]);

  return {
    totalLlamadas,
    llamadasHoy,
  };
}
