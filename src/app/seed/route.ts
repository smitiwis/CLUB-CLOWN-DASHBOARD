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
      nombre: "Luis Angel",
      apellido: "Peralta Diaz",
      telefono: "912342510",
      dni: "47156085",
      fecha_ingreso: "2024-01-15",
      estado: "1", // Puede ser "activo" o "inactivo"
      correo: "sistemas.luismi@gmail.com",
      password: "Rosefer-bb123", // Esto debería ser encriptado en producción
    },
    {
      nombre: "Kevin",
      apellido: "Arauco",
      telefono: "964912022",
      dni: "47638595",
      fecha_ingreso: "2024-12-15",
      estado: "1", // Puede ser "activo" o "inactivo"
      correo: "kevin@gmail.com",
      password: "123456", // Esto debería ser encriptado en producción
    }
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

// const seedClientes = async () => {
//   console.log("Conectando a la base de datos...");

//   // Datos iniciales
//   const clientes = [
//     {
//       telefono: "964912022",
//       nombre_apo: "",
//       nombre: "",
//       apellido: "",
//       edad: "0",
//       grupo: "",
//       estado: "",
//     },
//     {
//       telefono: "964918055",
//       nombre_apo: "Juan Gómez",
//       nombre: "Laura Gómez",
//       apellido: "Gómez Fernandez",
//       edad: "30",
//       grupo: "",
//       estado: ""
//     },
//   ];

//   // Inserción de usuarios
//   for (const cliente of clientes) {
//     const existingUser = await prisma.usuario.findUnique({
//       where: { telefono: cliente.telefono },
//     });
//     console.log("existingUser", existingUser);
//     if (!existingUser) {
//       await prisma.cliente.create({ data: cliente });
//     } else {
//       console.log(`Cliente con telefono ${cliente.telefono} ya existe.`);
//     }
//   }

//   console.log("Seed completado.");
// };

export async function GET() {
  try {
    // Llamar a la función que inserta los usuarios
    await seedUsuarios();
    // await seedClientes();

    // Responder con un mensaje de éxito
    return NextResponse.json({
      message: "Datos iniciales insertados exitosamente.",
    });
  } catch (error: unknown) {
    console.log(error);
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
