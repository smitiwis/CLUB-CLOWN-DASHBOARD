import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { redirect } from "next/navigation";
import { fetchProfileById } from "../usuarios/services";

export async function permisosPage(roles: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const profile = await fetchProfileById(session.user.id);
  if (!profile) redirect("/login");

  const userRol = profile.rol.nombre;

  if (!roles.includes(userRol)) redirect("/dashboard");
}
