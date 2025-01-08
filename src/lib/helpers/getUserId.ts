import { COLORES, GROUPS_CLIENT } from "@/constants";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../authOptions";

export const getUserId = async () => {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  return session.user.id || null;
};

export const getColor = (estado: string) => {
  return COLORES.find(({ key }) => key === estado)?.code || "";
};

export const getLabelColor = (estado: string) => {
  return COLORES.find(({ key }) => key === estado)?.label || "";
};

export const getGrupoCliente = (grupo: string) => {
  return GROUPS_CLIENT.find(({ key }) => key === grupo)?.label || "";
};
