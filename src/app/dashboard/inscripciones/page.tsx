import React from "react";
import InscritoList from "./resources/components/InscritoList";
import { fetchInscripciones } from "@/lib/inscripciones/services";
import { fetchProfileById } from "@/lib/usuarios/services";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // ⚡ Fuerza renderización en el servidor

const Page = async () => {
  const response = await fetchInscripciones({ page: 1, limit: 10 });

    const profile = await fetchProfileById();
    if (!profile) redirect("/login");
  
    const userProfile = {
      name: profile.nombre,
      rolName: profile.rol.nombre,
      callsPending: profile.callsPending,
    };
  

  if (response instanceof Error) {
    return <div>Error fetching inscritos</div>;
  }
  return <InscritoList inscripcionesResp={response} userProfile={userProfile}/>;
};

export default Page;
