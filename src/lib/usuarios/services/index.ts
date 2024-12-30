import { prisma } from "@/lib/prisma";

export async function fetchUsuarios() {
  try {
    // Obtener todos los usuarios de la tabla 'usuarios'
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
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

export async function fetchUserById(id_usuario: string) {
  try {
    const user = await prisma.usuarios.findUnique({
      where: {
        id_usuario,
      },
    });
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }
    return {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      dni: user.dni,
      fecha_ingreso: user.fecha_ingreso,
      estado: user.estado,
      correo: user.correo,
      password: '',
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener usuario.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
