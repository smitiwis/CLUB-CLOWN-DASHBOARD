"use server";

import bcrypt from "bcryptjs";
import { IStateUsuario, IUsuarioReq } from "../definicions";
import { schemaUsuario } from "../schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createUsuario(
  prevState: IStateUsuario,
  formData: IUsuarioReq
) {
  try {
    const validatedUsuario = await schemaUsuario.validate(formData, {
      abortEarly: false,
    });

    const {
      nombre,
      apellido,
      telefono,
      dni,
      fecha_ingreso,
      estado,
      correo,
      password,
    } = validatedUsuario;

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
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREAR USUARIO
    await prisma.usuarios.create({
      data: {
        nombre,
        apellido,
        telefono,
        dni,
        fecha_ingreso,
        estado,
        correo,
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

export async function editUsuario(
  prevState: IStateUsuario,
  formData: IUsuarioReq
) {
  try {
    const validatedUsuario = await schemaUsuario.validate(formData, {
      abortEarly: false,
    });

    const { nombre, apellido, telefono, dni, fecha_ingreso, estado, correo } =
      validatedUsuario;

    // VALIDAR POR CORREO
    const existingUser = await prisma.usuarios.findFirst({
      where: { correo: validatedUsuario.correo },
    });

    if (existingUser && existingUser.id_usuario !== formData.id_usuario) {
      throw {
        message: "El correo ya está registrado.",
        status: 400,
        field: "correo",
      };
    }

    // VALIDAR POR TELEFONO
    const existingUserPhone = await prisma.usuarios.findFirst({
      where: { telefono: validatedUsuario.telefono },
    });

    if (
      existingUserPhone &&
      existingUserPhone.id_usuario !== formData.id_usuario
    ) {
      throw {
        message: "El teléfono ya está registrado.",
        status: 400,
        field: "telefono",
      };
    }

    // VALIDAR POR DNI
    const existingUserDni = await prisma.usuarios.findFirst({
      where: { dni: validatedUsuario.dni },
    });

    if (existingUserDni && existingUserDni.id_usuario !== formData.id_usuario) {
      throw {
        message: "El DNI ya está registrado.",
        status: 400,
        field: "dni",
      };
    }

    // ACTUALIZAR USUARIO
    await prisma.usuarios.update({
      where: { id_usuario: formData.id_usuario },
      data: {
        nombre,
        apellido,
        telefono,
        dni,
        fecha_ingreso,
        estado,
        correo,
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
