import { prisma } from "@/lib/prisma";
import { IBPago } from "../definicions";
import { IPagination } from "@/lib/definitions";
import { fetchProfileById } from "@/lib/usuarios/services";

function getWhereClause(telefonoCliente?: string) {
  const whereClause: {
    taller_cliente?: {
      cliente?: {
        telefono?: { contains: string };
      };
    };
  } = {};

  if (telefonoCliente) {
    whereClause.taller_cliente = {
      cliente: {
        telefono: { contains: telefonoCliente },
      },
    };
  }

  return whereClause;
}

export async function fetchPagos(
  pagination: IPagination,
  phoneNumber?: string
) {
  const { page, limit } = pagination;

  try {
    const { rol } = await fetchProfileById();
    if (!rol) return new Error("Error al obtener rol");

    const where = getWhereClause(phoneNumber);

    // Calcular la paginación
    const skip = (page - 1) * limit;
    const take = limit;

    const total = await prisma.taller_cliente_pagos.count({ where });

    const pagos = await prisma.taller_cliente_pagos.findMany({
      where,
      skip,
      take,
      orderBy: { fecha_pago: "desc" },
      select: {
        id_taller_cliente_pago: true,
        monto: true,
        metodo_pago: true,
        fecha_pago: true,
        img_boucher: true,
        taller_cliente: {
          select: {
            estado_pago: true,
            cliente: {
              select: {
                nombre: true,
                apellido: true,
                telefono: true,
                grupo: true,
              },
            },
            taller: {
              select: {
                nombre: true,
                dias: true,
                hora: true,
              },
            },
          },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    // Transformamos los datos para agrupar en una estructura más clara
    const pagosFormateados: IBPago[] = pagos.map((pago, i) => ({
      id_taller_cliente_pago: pago.id_taller_cliente_pago,
      key: i + 1,
      monto: pago.monto,
      metodo_pago: pago.metodo_pago,
      fecha_pago: pago.fecha_pago,
      estado_pago: pago.taller_cliente.estado_pago,
      img_boucher: `${process.env.NEXT_PUBLIC_IMAGE_PATH}${pago.img_boucher}`,
      cliente: {
        nombre: pago.taller_cliente.cliente.nombre,
        apellido: pago.taller_cliente.cliente.apellido,
        telefono: pago.taller_cliente.cliente.telefono,
      },
      taller: {
        nombre: pago.taller_cliente.taller.nombre,
        dias: pago.taller_cliente.taller.dias,
        hora: pago.taller_cliente.taller.hora,
      },
    }));

    return {
      data: pagosFormateados,
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
