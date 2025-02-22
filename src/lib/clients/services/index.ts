import { prisma } from "@/lib/prisma";
import { IBClients, IBClientsResp } from "../definitions";
import { formatearNombre, getUserId } from "@/lib/helpers";
import { IPagination } from "@/lib/definitions";
import { format } from "@formkit/tempo";

export async function fetchClientById(id_cliente: string) {
  try {
    const id_usuario = await getUserId();
    if (!id_usuario) throw new Error("Usuario desconocido");

    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente },
      select: {
        id_cliente: true,
        telefono: true,
        nombre_apo: true,
        nombre: true,
        apellido: true,
        edad: true,
        grupo: true,
        categoria: true,
        estado: true,
        tipo_documento: true,
        nro_documento: true,
        direccion: true,
        nro_direccion: true,
        origen: true,
      },
    });

    if (!cliente) {
      throw new Error("cliente no encontrado.");
    }

    return {
      ...cliente,
      nro_documento: cliente.nro_documento || "",
    } as IBClients;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchClients(pagination: IPagination) {
  const { page, limit } = pagination;

  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    const total = await prisma.cliente.count({
      where: { id_usuario },
    });

    const clientes = await prisma.cliente.findMany({
      where: { id_usuario },
      skip: (page - 1) * limit,
      take: limit,
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
        categoria: true,
        estado: true,
        tipo_documento: true,
        nro_documento: true,
        direccion: true,
        nro_direccion: true,
        fecha_creacion: true,
        origen: true,
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

    return {
      data: clientesList,
      total,
      totalPages,
      page,
      limit,
    } as IBClientsResp;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener leads .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchClientsOptions() {
  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    const clientes = await prisma.cliente.findMany({
      where: {
        OR: [{ nombre: { not: "" } }, { apellido: { not: "" } }],
      },
      select: {
        id_cliente: true,
        telefono: true,
        nombre: true,
        apellido: true,
        origen: true,
      },
    });

    return clientes;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener clientes options .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchInscritosOptions() {
  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    const clientes = await prisma.taller_cliente.findMany({
      where: {
        estado_pago: {
          not: "pago_compl",
        },
        estado: "1",
      },
      select: {
        id_taller_cliente: true,
        precio_venta: true,
        estado_pago: true,

        cliente: {
          select: {
            nombre: true,
            apellido: true,
            telefono: true,
          },
        },
        taller: {
          select: {
            nombre: true,
            precio: true,
          },
        },
        taller_cliente_pagos: {
          select: {
            monto: true,
          },
        },
      },
    });

    // Procesar los datos para calcular el total pagado y el saldo pendiente
    const resultados = clientes.map((cliente) => {
      const totalPagado = cliente.taller_cliente_pagos.reduce(
        (acc, pago) => acc + pago.monto,
        0
      );
      const saldoPendiente = cliente.precio_venta - totalPagado;

      return {
        id_cliente: cliente.id_taller_cliente,
        nombre: cliente.cliente.nombre,
        apellido: cliente.cliente.apellido,
        telefono: cliente.cliente.telefono,
        taller: cliente.taller.nombre,
        totalPagado,
        saldoPendiente,
      };
    });

    return resultados;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener clientes options .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchDetailsClient(id_cliente: string) {
  const id_usuario = await getUserId();
  if (!id_usuario) throw new Error("Usuario desconocido");

  try {
    const clientes = await prisma.cliente.findUnique({
      where: { id_cliente },
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
            estado: true,
            observacion: true,
            tipo: true,
            resultado: true,
            fecha_creacion: true,
          },
        },
      },
    });

    if (!clientes) {
      throw new Error("cliente no encontrado.");
    }

    return clientes;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("No se pudo obtener las llamadas del cliente.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
