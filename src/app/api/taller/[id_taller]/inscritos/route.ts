import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type params = {
  params: Promise<{ id_taller: string }>;
};

export async function GET(request: NextRequest, { params }: params) {
  try {
    const idTaller = (await params).id_taller;

    if (!idTaller) {
      return Response.json(
        { mensaje: "ID de taller inválido" },
        { status: 400 }
      );
    }

    const clientesInscritos = await prisma.taller_cliente.findMany({
      where: {
        id_taller: idTaller, // Filtra por el taller específico
      },
      select: {
        id_taller_cliente: true,
        fecha_inscripcion: true,
        estado_pago: true,
        precio_venta: true,
        cliente: {
          select: {
            id_cliente: true,
            nombre: true,
            apellido: true,
            telefono: true,
            edad: true,
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                apellido: true,
                correo: true, // Puedes agregar más campos si los necesitas
              },
            },
          },
        },
        taller_cliente_pagos: {
          select: {
            monto: true,
            fecha_pago: true,
          },
        },
      },
      orderBy: {
        fecha_inscripcion: "desc", // Ordena del más reciente al más antiguo
      },
    });

    const clientesConPagoTotal = clientesInscritos.map((cliente, i) => {
      // Calcula la suma total de los pagos
      const pagoTotal = cliente.taller_cliente_pagos.reduce(
        (total, pago) => total + pago.monto,
        0
      );

      // Determina el estado de pago según la suma de pagos
      let estadoPago = cliente.estado_pago;
      if (pagoTotal === cliente.precio_venta) {
        estadoPago = "pago_compl"; // Pagado completamente
      } else if (pagoTotal > 0) {
        estadoPago = "pago_pend"; // Pago pendiente
      } else {
        estadoPago = "sin_pago"; // Sin pagos
      }

      return {
        key: i + 1,
        id_cliente: cliente.id_taller_cliente,
        nombre: cliente.cliente.nombre,
        apellido: cliente.cliente.apellido,
        telefono: cliente.cliente.telefono,
        edad: cliente.cliente.edad,
        estado_pago: estadoPago,
        precio_venta: cliente.precio_venta,
        fecha_inscripcion: cliente.fecha_inscripcion,
        pagoTotal,
        usuario: cliente.cliente.usuario,
      };
    });

    if (clientesInscritos.length === 0) {
      return Response.json(
        { mensaje: "No hay inscritos en este taller" },
        { status: 404 }
      );
    }

    return Response.json({ inscritos: clientesConPagoTotal }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener inscritos por id de taller", error);
    return Response.json(
      { mensaje: "Error al obtener inscritos por id de taller" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
