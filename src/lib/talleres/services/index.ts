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
      },
    });

    const talleres = talleresList.map((taller, i) => ({
      ...taller,
      key: i + 1,
      dias: taller.dias as IDias[],
    }));

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
        profesor: {
          select: {
            id_profesor: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    return talleres as IBTalleresOptions[];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener talleres options .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
