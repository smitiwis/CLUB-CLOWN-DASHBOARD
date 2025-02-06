import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const seedUsuarios = async () => {
  console.log("Conectando a la base de datos...");
  const roles = await prisma.rol.findMany();
  // Datos iniciales
  const usuarios = [
    {
      id_rol: roles[0].id_rol,
      tipo_documento: "1",
      nro_documento: "47156085",
      nombre: "Luis Angel",
      apellido: "Peralta Diaz",
      telefono: "912342510",
      fecha_ingreso: "2024-01-15",
      direccion: "Jr. Los Pinos 123",
      nro_direccion: "123",
      estado: "1", // Puede ser "activo" o "inactivo"
      correo: "sistemas.luismi@gmail.com",
      password: "Rosefer-bb123", // Esto debería ser encriptado en producción
    },
    {
      id_rol: roles[0].id_rol,
      tipo_documento: "1",
      nro_documento: "47189047",
      nombre: "Andreu",
      apellido: "Ayaipoma Condi",
      telefono: "954918555",
      fecha_ingreso: "2024-01-09",
      direccion: "Jr. Los Flores",
      nro_direccion: "147",
      estado: "0", // Puede ser "activo" o "inactivo"
      correo: "sistemas.luismi@gmail.com",
      password: "123456", // Esto debería ser encriptado en producción
    },
    {
      id_rol: roles[1].id_rol,
      tipo_documento: "1",
      nro_documento: "47968596",
      nombre: "Ester",
      apellido: "Carhuamaca Chancasanampa",
      telefono: "954232400",
      fecha_ingreso: "2024-12-15",
      direccion: "Jr. Los Real ",
      nro_direccion: "963",
      estado: "1", // Puede ser "activo" o "inactivo"
      correo: "ester@gmail.com",
      password: "123456", // Esto debería ser encriptado en producción
    },
    {
      id_rol: roles[2].id_rol,
      tipo_documento: "1",
      nro_documento: "47913612",
      nombre: "Kevin",
      apellido: "Arauco",
      telefono: "964912022",
      fecha_ingreso: "2024-12-15",
      direccion: "Jr. Los Rosales",
      nro_direccion: "1521",
      estado: "1", // Puede ser "activo" o "inactivo"
      correo: "kevin@gmail.com",
      password: "123456", // Esto debería ser encriptado en producción
    },
  ];

  // Inserción de usuarios
  for (const usuario of usuarios) {
    const existingUser = await prisma.usuario.findUnique({
      where: { correo: usuario.correo },
    });

    if (!existingUser) {
      // Encriptar la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(usuario.password, 10);
      console.log("usuarios", usuarios);

      await prisma.usuario.create({
        data: {
          ...usuario,
          password: hashedPassword, // Guardar la contraseña encriptada
        },
      });
    } else {
      console.log(`Usuario con correo ${usuario.correo} ya existe.`);
    }
  }

  console.log("Seed completado.");
};

const seedProfesores = async () => {
  console.log("Conectando a la base de datos...");

  // Datos iniciales
  const profesores = [
    {
      nombre: "Erick",
      apellidos: "Zar",
      email: "erick@gmail.com",
      telefono: "912345678",
      especialidad: "Clown",
      estado: "1",
    },
    {
      nombre: "Juan Manuel",
      apellidos: "Gonzales",
      email: "Juan@gmail.com",
      telefono: "914567890",
      especialidad: "Teatro",
      estado: "0",
    },
    {
      nombre: "Nathaly",
      apellidos: "Fernandez",
      email: "Nathaly@gmail.com",
      telefono: "916789012",
      especialidad: "Origen",
      estado: "1",
    },
    {
      nombre: "Andrea",
      apellidos: "Garcia",
      email: "Andrea@gmail.com",
      telefono: "964567890",
      especialidad: "Comedia",
      estado: "1",
    },
  ];

  // Inserción de profesores
  for (const profesor of profesores) {
    await prisma.profesor.create({ data: profesor });
  }

  console.log("Seed PROFESOR completado.");
};

const seedRoles = async () => {
  console.log("Conectando a la base de datos...");

  // Datos iniciales
  const roles = [
    { nombre: "admin", estado: "1" },
    { nombre: "comercial", estado: "1" },
    { nombre: "marketing", estado: "1" },
  ];

  for (const rol of roles) {
    // Verifica si el rol ya existe
    const existingRol = await prisma.rol.findUnique({
      where: { nombre: rol.nombre },
    });

    // Inserta el rol solo si no existe
    if (!existingRol) {
      await prisma.rol.create({ data: rol });
    } else {
      console.log(`El rol '${rol.nombre}' ya existe. No se insertará.`);
    }
  }

  console.log("Seed ROL completado.");
};

const seedPromociones = async () => {
  console.log("Conectando a la base de datos...");

  // Datos iniciales
  const promociones = [
    {
      nombre: "Paga por clase",
      detalles: "Paga S/25 por clase",
      descuento: 100,
      estado: "1",
    },
    {
      nombre: "Promo verano 2025",
      detalles: "Promoción verano",
      descuento: 50,
      estado: "1",
    },
    {
      nombre: "Promo 2",
      detalles: "Cierre de mes",
      descuento: 80,
      estado: "1",
    },
    {
      nombre: "Promo 3",
      detalles: "Promoción 3",
      descuento: 40,
      estado: "1",
    },
    {
      nombre: "Promo 4",
      detalles: "Promoción amistades",
      descuento: 0,
      estado: "0",
    },
  ];

  // Inserción de promociones
  for (const promocion of promociones) {
    await prisma.taller_promocion.create({ data: promocion });
  }

  console.log("Seed PROMOCION completado.");
};

const seedAsistencia = async () => {
  console.log("Conectando a la base de datos...");

  // Datos iniciales
  const asistencias = [
    {
      id_taller_cliente: "d51a58d6-58dc-4ca1-ad04-b8d81fde07f1",
      fecha_asistencia: new Date("2025-02-05 02:27:19.289"),
      estado: "0",
    },

    {
      id_taller_cliente: "e0eefa44-b765-4e97-a487-cb700b08f0cb",
      fecha_asistencia: new Date("2025-02-05 02:27:19.289"),
      estado: "1",
    },
  ];

  // Inserción de asistencias
  for (const asistencia of asistencias) {
    await prisma.taller_asistencia.create({ data: asistencia });
  }
};

export async function GET() {
  try {
    // Llamar a la función que inserta los usuarios
    await seedRoles();
    await seedUsuarios();
    await seedProfesores();
    await seedPromociones();

    await seedAsistencia();

    // Responder con un mensaje de éxito
    return NextResponse.json({
      message: "Datos iniciales insertados exitosamente.",
    });
  } catch (error: unknown) {
    console.log("=== ERROR === ", error);
    // Usar 'unknown' en lugar de 'any'
    // Verificar si el error tiene la propiedad 'message'
    if (error instanceof Error) {
      console.error("Error al insertar:", error.message);
      // Responder con un mensaje de error
      return NextResponse.json(
        { message: "Error al insertar", error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Error desconocido:", error);
      return NextResponse.json(
        {
          message: "Error desconocido",
          error: "No se pudo identificar el error.",
        },
        { status: 500 }
      );
    }
  }
}
