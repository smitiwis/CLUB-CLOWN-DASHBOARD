import { fetchLlamadas } from "@/lib/llamadas/services";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import CallsList from "../components/CallsList";

const Page = async () => {
  const callsList = await fetchLlamadas();
  if (callsList instanceof Error) {
    console.error("Error al cargar las llamadas", callsList);
    return <div>Error al cargar las llamadas</div>;
  }
  console.log("callsList", callsList);
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1>Lista de Llamadas</h1>
        <Button as={Link} color="primary" href="/dashboard/llamar/registrar">
          NUEVA LLAMADA
        </Button>
      </div>
      <CallsList callsList={callsList} />
    </>
  );
};

export default Page;
