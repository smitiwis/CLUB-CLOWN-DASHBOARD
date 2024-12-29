"use server";

import bcrypt from "bcryptjs";
import { IStateUsuario, IUsuarioForm } from "../definicions";
import { schemaUsuario } from "../schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
await prisma.$connect();

export async function createUsuario(
  prevState: IStateUsuario,
  formData: IUsuarioForm
) {
  try {
    const validatedUsuario = await schemaUsuario.validate(formData, {
      abortEarly: false,
    });

    // VALIDAR POR CORREO
    const existingUser = await prisma.usuarios.findUnique({
      where: { correo: validatedUsuario.correo },
    });

    if (existingUser) {
      throw {
        message: "El correo ya está registrado.",
        status: 400,
        field: "correo",
      };
    }

    // VALIDAR POR TELEFONO
    const existingUserPhone = await prisma.usuarios.findUnique({
      where: { telefono: validatedUsuario.telefono },
    });

    if (existingUserPhone) {
      throw {
        message: "El teléfono ya está registrado.",
        status: 400,
        field: "telefono",
      };
    }

    // VALIDAR POR DNI
    const existingUserDni = await prisma.usuarios.findUnique({
      where: { dni: validatedUsuario.dni },
    });

    if (existingUserDni) {
      throw {
        message: "El DNI ya está registrado.",
        status: 400,
        field: "dni",
      };
    }

    // ENCRYPTAR LA CONTRASEÑA
    const { password } = validatedUsuario;
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREAR USUARIO
    await prisma.usuarios.create({
      data: {
        ...validatedUsuario,
        password: hashedPassword, // Guardar la contraseña encriptada
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    } else if (typeof error === "object") {
      return error;
    } else {
      return { message: "Error desconocido" };
    }
  }

  revalidatePath("/dashboard/usuarios");
  redirect("/dashboard/usuarios");
}
