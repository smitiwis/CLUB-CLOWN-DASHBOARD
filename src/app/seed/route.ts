import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
console.log("connected to db");

const seedUsuarios = async () => {
  console.log("Conectando a la base de datos...");

  // Datos iniciales
  const usuarios = [
    {
      nombre: "Carlos Martínez",
      apellido: "Peralta",
      telefono: "551234567",
      dni: "12345678",
      fecha_ingreso: "2024-01-15",
      estado: "activo", // Puede ser "activo" o "inactivo"
      correo: "sistem@gmail.com",
      password: "123456", // Esto debería ser encriptado en producción
    },
    {
      nombre: "Laura Gómez",
      apellido: "Gómez",
      telefono: "559876543",
      dni: "87654321",
      fecha_ingreso: "2024-02-01",
      estado: "activo", // Puede ser "activo" o "inactivo"
      correo: "ejemplo@gmail.com",
      password: "123456", // Esto debería ser encriptado en producción
    },
  ];

  // Inserción de usuarios
  for (const usuario of usuarios) {
    const existingUser = await prisma.usuarios.findUnique({
      where: { correo: usuario.correo },
    });
    console.log("existingUser", existingUser);
    if (!existingUser) {
      // Encriptar la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(usuario.password, 10);
      console.log("usuarios", usuarios);

      await prisma.usuarios.create({
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

export async function GET() {
  try {
    // Llamar a la función que inserta los usuarios
    await seedUsuarios();

    // Responder con un mensaje de éxito
    return NextResponse.json({
      message: "Usuarios iniciales insertados exitosamente.",
    });
  } catch (error: unknown) {
    console.log(error)
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
