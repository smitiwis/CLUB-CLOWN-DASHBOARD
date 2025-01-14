import { prisma } from "@/lib/prisma";

export async function fetchUsuarios() {
  try {
    // Obtener todos los usuarios de la tabla 'usuarios'
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        telefono: true,
        dni: true,
        fecha_ingreso: true,
        estado: true,
        correo: true,
        rol: {
          select: {
            id_rol: true,
            nombre: true,
          },
        },
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
    const user = await prisma.usuario.findUnique({
      where: {
        id_usuario,
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        telefono: true,
        dni: true,
        fecha_ingreso: true,
        estado: true,
        correo: true,
        rol: {
          select: {
            id_rol: true,
            nombre: true,
          },
        },
      },
    });
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }
    return user;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener usuario.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchProfileById(id_usuario: string) {
  try {
    const user = await prisma.usuario.findUnique({
      where: {
        id_usuario,
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        telefono: true,
        dni: true,
        fecha_ingreso: true,
        estado: true,
        correo: true,
        rol: {
          select: {
            id_rol: true,
            nombre: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    const callsPending = await prisma.cliente_llamada.count({
      where: {
        id_usuario, // Reemplaza con el ID del usuario
        estado_agenda: "1", // Estado pendiente
        fecha_agendada: { not: null }, // Asegurarse de que está agendada
      },
    });

    return {
      nombre: user.nombre,
      apellido: user.apellido,
      estado: user.estado,
      callsPending,

      rol: {
        id_rol: user.rol.id_rol,
        nombre: user.rol.nombre,
      },
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener usuario.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}
