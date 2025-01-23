import { getUserId } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { IBPromoOptions } from "../definitions";

export async function fetchPromocionesOptions() {
  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    // quiero obtener el precio de la inscripcion


    const promociones = await prisma.taller_promocion.findMany({
      select:{
        id_taller_promocion: true,
        nombre: true,
        detalles: true,
        descuento: true,
        estado: true,
      }
    });

    return promociones as IBPromoOptions[];

  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener promociones options .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
