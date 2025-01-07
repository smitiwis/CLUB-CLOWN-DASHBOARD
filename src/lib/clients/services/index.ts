import { prisma } from "@/lib/prisma";
import { IBClientRes } from "../definitions";
import { getUserId } from "@/lib/helpers";

export async function fetchClientById(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Usuario desconocido");

    const cliente = await prisma.cliente.findUnique({
      where: {
        id_cliente: id,
        id_usuario: userId,
      },
      select: {
        id_cliente: true,
        telefono: true,
        nombre_apo: true,
        nombre: true,
        apellido: true,
        edad: true,
        grupo: true,
        estado: true,
      },
    });

    if (!cliente) {
      throw new Error("cliente no encontrado.");
    }

    return cliente;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchClients() {
  try {
    const userId = await getUserId();
    if (!userId) return new Error("Usuario desconocido");

    const clientes: IBClientRes[] = await prisma.cliente.findMany({
      where: {
        id_usuario: userId,
      },
      select: {
        id_cliente: true,
        telefono: true,
        nombre_apo: true,
        nombre: true,
        apellido: true,
        edad: true,
        grupo: true,
        estado: true,
      },
    });

    return clientes;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener leads .");
  }finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
