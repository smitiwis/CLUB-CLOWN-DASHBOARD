import React from "react";
import InscritoList from "./resources/components/InscritoList";
import { fetchInscripciones } from "@/lib/inscripciones/services";
import {
  fetchProfileById,
  fetchUsuariosOptions,
} from "@/lib/usuarios/services";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // ⚡ Fuerza renderización en el servidor

const Page = async () => {
  const paginate = { page: 1, limit: 10 };
  const filter = { id_usuario: "all" };

  const response = await fetchInscripciones(paginate, filter);

  const profile = await fetchProfileById();
  if (!profile) redirect("/login");

  const usuarios = await fetchUsuariosOptions();

  const usuariosOptions = [
    ...usuarios,
    { label: "Todos", code: "all", key: "all", telefono: "" },
  ];

  const userProfile = {
    name: profile.nombre,
    rolName: profile.rol.nombre,
    callsPending: profile.callsPending,
  };

  if (response instanceof Error) {
    return <div>Error fetching inscritos</div>;
  }
  return (
    <InscritoList
      inscripcionesResp={response}
      userProfile={userProfile}
      usuarios={usuariosOptions}
    />
  );
};

export default Page;
