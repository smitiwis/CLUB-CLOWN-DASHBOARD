import { IDias } from "@/app/dashboard/talleres/(resources)/definitions";
import { IPagination } from "@/lib/definitions";
import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { IBTalleresOptions } from "../definicions";

export async function fetchTalleres(pagination: IPagination) {
  const { page, limit } = pagination;

  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    // Calcular la paginación
    const skip = (page - 1) * limit;
    const take = limit;

    const total = await prisma.taller.count();

    const talleresList = await prisma.taller.findMany({
      skip,
      take,
      orderBy: { fecha_creacion: "desc" },
      select: {
        id_taller: true,
        nombre: true,
        dias: true,
        hora: true,
        precio: true,
        cant_clases: true,
        estado: true,
        profesor: {
          select: {
            id_profesor: true,
            nombre: true,
            apellidos: true,
          },
        },
        // obtener la cantidad de alumnos que tiene este taller
        taller_cliente: {
          select: {
            id_taller_cliente: true,
          },
        },
      },
    });

    const talleres = talleresList.map((taller, i) => ({
      ...taller,
      key: i + 1,
      dias: taller.dias as IDias[],
      inscritos: taller.taller_cliente.length,
    }));

    console.log(talleres);

    const totalPages = Math.ceil(total / limit);

    return {
      data: talleres,
      pagination: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener talleres .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchTalleresOptions() {
  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    const talleres = await prisma.taller.findMany({
      where: { estado: "1" },
      select: {
        id_taller: true,
        nombre: true,
        dias: true,
        hora: true,
        precio: true,
        cant_clases: true,
        taller_cliente: true,
        profesor: {
          select: {
            id_profesor: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    const tallerOptions = talleres.map((taller) => {
      return {
        id_taller: taller.id_taller,
        nombre: taller.nombre,
        dias: taller.dias as IDias[],
        hora: taller.hora,
        precio: taller.precio,
        cant_clases: taller.cant_clases,
        profesor: taller.profesor,
        inscritos: taller.taller_cliente.length,
      };
    });

    return tallerOptions as IBTalleresOptions[];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener talleres options .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchAlumnosByTallerId(id_taller: string) {
  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    // OBTENER EL NOMBRE DEL TALLER QUE ESTA ASOCIADO AL ID
    const taller = await prisma.taller.findUnique({
      where: {
        id_taller,
      },
      select: {
        nombre: true,
      },
    });

    const getAlumnos = await prisma.taller_cliente.findMany({
      where: {
        id_taller, // Reemplaza con el ID real del taller
      },
      select: {
        id_taller_cliente: true,
        cliente: {
          select: {
            id_cliente: true,
            nombre: true,
            apellido: true,
            telefono: true,
          },
        },
        precio_venta: true,
        estado_pago: true,
        taller_cliente_pagos: {
          select: {
            monto: true,
          },
        },
        taller_asistencia: {
          select: {
            id_asistencia: true,
            fecha_asistencia: true,
            estado: true,
            id_taller_cliente: true,
          },
        },
      },
    });

    const alumnos = getAlumnos.map((alumno, i) => {
      const totalPagado = alumno.taller_cliente_pagos.reduce(
        (acc, pago) => acc + pago.monto,
        0
      );

      return {
        index: i + 1,
        id_cliente: alumno.id_taller_cliente,
        nombre: alumno.cliente.nombre,
        apellido: alumno.cliente.apellido,
        telefono: alumno.cliente.telefono,
        asistencias: alumno.taller_asistencia.map((a) => ({
          id_asistencia: a.id_asistencia,
          fecha_asistencia: a.fecha_asistencia,
          estado: a.estado, // 1: asistió, 0: falta
        })),
        deudor: totalPagado < alumno.precio_venta,
        deuda: Math.max(alumno.precio_venta - totalPagado, 0),
      };
    });

    return {
      alumnos,
      tallerName: taller?.nombre,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error al obtener alumnos por taller .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
