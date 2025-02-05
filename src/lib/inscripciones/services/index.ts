import { IPagination } from "@/lib/definitions";
import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";

export async function fetchInscripciones(
  pagination: IPagination,
  telefonoCliente?: string
) {
  const { page, limit } = pagination;

  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    const where = {
      cliente: {
        telefono: { contains: telefonoCliente },
      },
    };

    // Calcular la paginación
    const skip = (page - 1) * limit;
    const take = limit;

    const total = await prisma.taller_cliente.count();

    const data = await prisma.taller_cliente.findMany({
      where,
      skip,
      take,
      orderBy: {
        fecha_inscripcion: "desc", // Ordena de más reciente a más antiguo
      },
      select: {
        id_taller_cliente: true,
        estado_pago: true,
        precio_venta: true,
        observacion: true,
        estado: true,

        cliente: {
          select: {
            id_cliente: true,
            nombre: true,
            apellido: true,
            nombre_apo: true,
            telefono: true,

            // Asesor que registró al cliente
            usuario: {
              select: {
                id_usuario: true,
                nombre: true,
                apellido: true,
              },
            },
          },
        },

        taller: {
          select: {
            nombre: true,
            cant_clases: true,
            hora: true,
            dias: true,
            precio: true,
            profesor: {
              select: {
                nombre: true,
                apellidos: true,
                telefono: true,
              },
            },
          },
        },

        taller_promocion: {
          select: {
            id_taller_promocion: true,
            nombre: true,
            descuento: true,
          },
        },

        taller_cliente_pagos: {
          select: {
            id_taller_cliente_pago: true,
            monto: true,
            metodo_pago: true,
            img_boucher: true,
            fecha_pago: true,
            nro_transaccion: true,
          },
        },

        // Asesor que inscribió al cliente en el taller a un taller
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    const inscripciones = data.map((item, i) => ({
      id: item.id_taller_cliente,
      key: i + 1,
      nombre: `${item.cliente.nombre} ${item.cliente.apellido}`.trim(),
      telefono: item.cliente.telefono,
      estadoPago: item.estado_pago,
      precioVenta: item.precio_venta,
      observacion: item.observacion,
      estado: item.estado,

      taller: {
        nombre: item.taller.nombre,
        clases: item.taller.cant_clases,
        horario: item.taller.hora,
        telefono: item.taller.profesor.telefono,
        dias: item.taller.dias,
        profesor: item.taller.profesor,
        precio: item.taller.precio,
      },
      promocion: item.taller_promocion
        ? {
            id: item.taller_promocion.id_taller_promocion,
            nombre: item.taller_promocion.nombre,
            descuento: item.taller_promocion.descuento,
          }
        : null,
      pagos: item.taller_cliente_pagos.map((pago) => ({
        id: pago.id_taller_cliente_pago,
        monto: pago.monto,
        metodo: pago.metodo_pago,
        fecha: pago.fecha_pago,
        nroTransaccion: pago.nro_transaccion,
        imgBoucher: `${process.env.CLOUDINARY_IMAGE}${pago.img_boucher}`,
      })),

      // Asesor que registró al cliente
      asesorRegistro: {
        id: item.cliente.usuario.id_usuario,
        nombre:
          `${item.cliente.usuario.nombre} ${item.cliente.usuario.apellido}`.trim(),
      },
      // Asesor que inscribió al cliente al taller
      asesorInscripcion: {
        id: item.usuario.id_usuario,
        nombre: `${item.usuario.nombre} ${item.usuario.apellido}`.trim(),
      },
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data: inscripciones,
      pagination: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener inscritos.");
  } finally {
    await prisma.$disconnect();
  }
}
