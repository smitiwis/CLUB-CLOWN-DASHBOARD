import { prisma } from "@/lib/prisma";
import { IBClientRes } from "../definitions";
import { getUserId } from "@/lib/helpers";

export async function fetchClientById(id_cliente: string) {
  try {
    const id_usuario = await getUserId();
    if (!id_usuario) throw new Error("Usuario desconocido");

    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente, id_usuario },
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
      },
    });

    if (!cliente) {
      throw new Error("cliente no encontrado.");
    }

    return cliente as IBClientRes;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchClients() {
  try {
    const id_usuario = await getUserId();
    if (!id_usuario) return new Error("Usuario desconocido");

    const clientes = await prisma.cliente.findMany({
      where: { id_usuario },
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
        fecha_agendada: true,
      },
    });

    return clientes as IBClientRes[];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener leads .");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchDetailsClient(id_cliente: string) {
  const id_usuario = await getUserId();
  if (!id_usuario) throw new Error("Usuario desconocido");

  try {
    const clientes = await prisma.cliente.findUnique({
      where: { id_usuario, id_cliente },
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
        fecha_agendada: true,
        cliente_llamada: {
          select: {
            id_cliente_llamada: true,
            estado: true,
            observacion: true,
            tipo: true,
            resultado: true,
            fecha_creacion: true,
          }
        }
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
