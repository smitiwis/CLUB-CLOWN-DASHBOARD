import { fetchTalleres } from "@/lib/talleres/services";
import React from "react";
import TalleresList from "./(resources)/components/TalleresList";

const Page = async () => {
  const pagination = { page: 1, limit: 10 };
  const talleresData = await fetchTalleres(pagination);

  if (talleresData instanceof Error) {
    console.error("Error al cargar las llamadas");
    return <div>Error al cargar las llamadas</div>;
  }

  return <TalleresList talleresData={talleresData} />;
};

export default Page;
