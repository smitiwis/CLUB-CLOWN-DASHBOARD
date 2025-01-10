"use server";

import bcrypt from "bcryptjs";
import {
  IStateDeleteUser,
  IStateUsuario,
  IUsuarioForm,
  IUsuarioReq,
} from "../definicions";
import { schemaUsuario } from "../schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createUsuario(
  prevState: IStateUsuario,
  formData: IUsuarioForm
) {
  try {
    const validatedUsuario = await schemaUsuario.validate(formData, {
      abortEarly: false,
    });

    const {
      id_rol,
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
    const existingUser = await prisma.usuario.findUnique({
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
    const existingUserPhone = await prisma.usuario.findUnique({
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
    const existingUserDni = await prisma.usuario.findUnique({
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
    await prisma.usuario.create({
      data: {
        id_rol, // Rol de usuario
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
    const existingUser = await prisma.usuario.findFirst({
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
    const existingUserPhone = await prisma.usuario.findFirst({
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
    const existingUserDni = await prisma.usuario.findFirst({
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
    await prisma.usuario.update({
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

export async function deleteUsuarioById(
  prevState: IStateDeleteUser,
  payload: string
) {
  console.timeLog("deleteUsuario", payload);
  try {
    if (!payload) {
      throw { message: "No se ha encontrado el usuario.", status: 404 };
    }

    await prisma.usuario.delete({
      where: { id_usuario: payload },
    });

    revalidatePath("/dashboard/usuarios");
    return { message: "Usuario eliminado correctamente.", status: 200 };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    } else if (typeof error === "object") {
      return error;
    } else {
      return { message: "Error desconocido" };
    }
  }
}
