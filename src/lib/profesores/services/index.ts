import { IPagination } from "@/lib/definitions";
import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { format } from "@formkit/tempo";

export async function fetchProfesores(pagination: IPagination) {
  const { page, limit } = pagination;

  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    // Calcular la paginación
    const skip = (page - 1) * limit;
    const take = limit;

    const total = await prisma.profesor.count();
    const profesores = await prisma.profesor.findMany({ skip, take });

    const profesoresList = profesores.map((prof, i) => {
      return {
        ...prof,
        key: i + 1,
        fecha_creacion: format(prof.fecha_creacion, {
          date: "medium",
          time: "short",
        }),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: profesoresList,
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
