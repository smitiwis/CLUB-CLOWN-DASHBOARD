/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";

import { AuthOptions, DefaultSession, Session } from "next-auth";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60, // 4 hours
  },

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
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }: any): Promise<DefaultSession | Session> {
      if (token) session.user.id = token.id;

      return session;
    },
  },
};
