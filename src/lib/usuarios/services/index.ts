import { prisma } from "@/lib/prisma";
import { IUsuarioByIdRes, IUsuarioRes } from "../definicions";
import { getUserId } from "@/lib/helpers";

export async function fetchUsuarios() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        tipo_documento: true,
        nro_documento: true,
        nombre: true,
        apellido: true,
        telefono: true,
        fecha_ingreso: true,
        direccion: true,
        nro_direccion: true,
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

    return usuarios as IUsuarioRes[];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener usuarios.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchUsuariosOptions() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        telefono: true,
      },
    });

    const usuariosOptions = usuarios.map((usuario) => ({
      label: `${usuario.nombre} ${usuario.apellido}`,
      code: usuario.id_usuario,
      key: usuario.id_usuario,
      telefono: usuario.telefono,
    }));

    return usuariosOptions;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener usuarios options.");
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
        tipo_documento: true,
        nro_documento: true,
        nombre: true,
        apellido: true,
        telefono: true,
        fecha_ingreso: true,
        direccion: true,
        nro_direccion: true,
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
    return user as IUsuarioByIdRes;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener usuario.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}

export async function fetchProfileById() {
  try {
    const id_usuario = await getUserId();

    if (!id_usuario) {
      throw new Error("Usuario desconocido.");
    }
    
    const user = await prisma.usuario.findUnique({
      where: { id_usuario },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        telefono: true,
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

