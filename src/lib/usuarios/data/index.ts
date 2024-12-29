import { prisma } from "@/lib/prisma";


export async function fetchInvoiceById(id: string) {
  console.log("fetchInvoiceById", id);
}

export async function fetchUsuarios() {
  try {
    // Obtener todos los usuarios de la tabla 'usuarios'
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        telefono: true,
        dni: true,
        fecha_ingreso: true,
        estado: true,
        correo: true,
      },
    });

    return usuarios;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener usuarios.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}