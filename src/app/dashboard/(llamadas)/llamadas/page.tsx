import { fetchLlamadas } from "@/lib/llamadas/services";
import React from "react";
import CallsList from "../components/CallsList";

const Page = async () => {
  const pagination = { page: 1, limit: 10 };
  const callsData = await fetchLlamadas(pagination);

  if (callsData instanceof Error) {
    console.error("Error al cargar las llamadas");
    return <div>Error al cargar las llamadas</div>;
  }
  return <CallsList callsData={callsData} />;
};

export default Page;
