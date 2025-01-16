import { prisma } from "@/lib/prisma";

export async function fetchRoles() {
  try {
    // Obtener todos los usuarios de la tabla 'usuarios'
    const roles = await prisma.rol.findMany();
    return roles;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error al obtener usuarios.");
  } finally {
    await prisma.$disconnect(); // Asegurarse de desconectar la base de datos
  }
}