import { redirect } from "next/navigation";
import { fetchProfileById } from "../usuarios/services";

export async function permisosPage(roles: string[]) {
  const profile = await fetchProfileById();
  if (!profile) redirect("/login");

  const userRol = profile.rol.nombre;

  if (!roles.includes(userRol)) redirect("/dashboard");
}
