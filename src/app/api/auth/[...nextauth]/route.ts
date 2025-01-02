/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";

import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.correo && !credentials?.password) {
          throw new Error("Engrese su correo y contraseña");
        }
        const { correo, password } = credentials;
        try {
          const user = await prisma.usuario.findUnique({ where: { correo } });
          if (!user) {
            throw new Error("Correo o contraseña es incorrecta");
          }

          const isCorrectPass = await bcrypt.compare(password, user.password);
          if (!isCorrectPass) {
            throw new Error("Correo o contraseña es incorrecta");
          }
          return {
            id: user.id_usuario,
            name: user.nombre,
            email: user.correo,
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  }

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
