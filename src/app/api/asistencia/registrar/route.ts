import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId();
    if (!userId) {
      return Response.json(
        { mensaje: "Usuario no autorizado" },
        { status: 401 }
      );
    }

    // BUSCAR SI EL ALUMNO YA TIENE UNA ASISTENCIA REGISTRADA HOY
    const body = await request.json();
    const clientId = body.clientId;

    if (!clientId) {
      return Response.json(
        { mensaje: "No se ha proporcionado el id del cliente" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const alumnoAsistenciaHoy = await prisma.taller_asistencia.findMany({
      where: {
        id_taller_cliente: clientId,
        fecha_asistencia: {
          gte: today, // Fecha mayor o igual a hoy (00:00:00)
          lt: tomorrow, // Fecha menor a mañana (00:00:00)
        },
      },
    });

    // SI NO HAY UN REGISTRO HOY, REGISTRAR ASISTENCIA A TODOS LOS ALUMNOS DEL TALLER
    // Y MARCAR AL ALUMNO QUE SE ESTA REGISTRANDO COMO ASISTENTE Y A LOS DEMAS COMO NO ASISTENTES
    if (alumnoAsistenciaHoy.length === 0) {
      // OBTENEMOS MAS INFO DEL CLIENTE PARA OBTENER EL ID DEL TALLER
      const cliente = await prisma.taller_cliente.findUnique({
        where: { id_taller_cliente: clientId },
        select: { id_taller: true },
      });

      if (!cliente) {
        return Response.json(
          { mensaje: "No se ha encontrado el cliente" },
          { status: 404 }
        );
      }

      // OBTENER LISTA DE ALUMNOS DEL TALLER
      const tallerIdList = await prisma.taller_cliente.findMany({
        where: { id_taller: cliente.id_taller },
        select: { id_cliente: true, id_taller_cliente: true },
      });


      if (!tallerIdList) {
        return Response.json(
          { mensaje: "No se han encontrado alumnos en el taller seleccionado" },
          { status: 404 }
        );
      }

      // REGISTRAR ASISTENCIA A TODOS LOS ALUMNOS DEL TALLER POR DEFAUTL ES "0"
      // Y MARCAR AL ALUMNO QUE SE ESTA REGISTRANDO COMO ASISTENTE
      tallerIdList.forEach(async (alumno) => {
        await prisma.taller_asistencia.create({
          data: {
            id_taller_cliente: alumno.id_taller_cliente,
            fecha_asistencia: new Date(),
            estado: alumno.id_taller_cliente === clientId ? "1" : "0",
          },
        });
      });

      return Response.json(
        { estado: "Asistencias registrada" },
        { status: 200 }
      );
    }

    // SI HAY UN REGISTRO HOY ENTONCES ACTULIZAMOS EL ESTADO
    await prisma.taller_asistencia.update({
      where: {
        id_asistencia: alumnoAsistenciaHoy[0].id_asistencia,
      },
      data: {
        estado: alumnoAsistenciaHoy[0].estado === "1" ? "0" : "1",
      },
    });

    return Response.json(
      {
        estado: `Asistencia actualizada ${
          alumnoAsistenciaHoy[0].estado === "0" ? "1" : "0"
        }`,
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
