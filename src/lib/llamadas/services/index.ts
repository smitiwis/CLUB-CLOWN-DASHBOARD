import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { format } from "@formkit/tempo";
import { IBClientCallRes, RESULTADO_CALL, TIPO_CALL } from "../definitions";

export async function fetchLlamadas() {
  try {
    const userId = await getUserId();
    if (!userId) return new Error("Usuario desconocido");

    const llamadas = await prisma.cliente_llamada.findMany({
      where: {
        id_usuario: userId,
      },
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
        fecha_creacion: format(llamada.fecha_creacion, 'D de MMM h:mm a'),
      }
    });

    return callsList;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener leads .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
