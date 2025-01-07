import React from "react";
import { fetchClientById } from "@/lib/clients/services";
import { redirect } from "next/navigation";
import FormRegisterCall from "../../../components/FormRegisterCall";

type Params = {
  params: Promise<{ id_cliente: string }>;
};


const Page = async ({ params }: Params) => {
  const getParams = await params;
  const { id_cliente } = getParams;
  if (!id_cliente) {
    redirect("/dashboard/leads");
  }

  const clientes = await fetchClientById(id_cliente);
  if (clientes instanceof Error) {
    return <div>Error: {clientes.message}</div>;
  }

  return <FormRegisterCall clientOptions={[clientes]} />;
};

export default Page;