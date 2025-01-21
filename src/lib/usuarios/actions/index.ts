"use server";

import bcrypt from "bcryptjs";
import {
  IStateDeleteUser,
  IStateUsuario,
  IUsuarioForm,
  IUsuarioReq,
} from "../definicions";
import { schemaUsuario, schemaUsuarioEdit } from "../schemas";
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
      tipo_documento,
      nro_documento,
      nombre,
      apellido,
      telefono,
      fecha_ingreso,
      direccion,
      nro_direccion,
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
      where: { nro_documento: validatedUsuario.nro_documento },
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
    const data = {
      id_rol, // Rol de usuario
      tipo_documento,
      nro_documento,
      nombre,
      apellido,
      telefono,
      fecha_ingreso,
      direccion,
      nro_direccion,
      estado,
      correo,
      password: hashedPassword,
    };

    // CREAR USUARIO
    await prisma.usuario.create({ data });
  } catch (error) {
    console.error("error", error);
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
    const validatedUsuario = await schemaUsuarioEdit.validate(formData, {
      abortEarly: false,
    });

    const {
      telefono,
      fecha_ingreso,
      direccion,
      nro_direccion,
      estado,
      correo,
      password,
    } = validatedUsuario;

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
      where: { nro_documento: validatedUsuario.nro_documento },
    });

    if (existingUserDni && existingUserDni.id_usuario !== formData.id_usuario) {
      throw {
        message: "El DNI ya está registrado.",
        status: 400,
        field: "dni",
      };
    }
    const data: Record<string, string> = {
      telefono,
      fecha_ingreso,
      direccion,
      nro_direccion,
      estado,
      correo,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(validatedUsuario.password, 10);
      data.password = hashedPassword;
    }
    // ACTUALIZAR USUARIO
    await prisma.usuario.update({
      where: { id_usuario: formData.id_usuario },
      data,
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
    console.error("Error al editar usuario:", error);
    if (error instanceof Error) {
      return { message: error.message };
    } else if (typeof error === "object") {
      return error;
    } else {
      return { message: "Error desconocido" };
    }
  }
}
