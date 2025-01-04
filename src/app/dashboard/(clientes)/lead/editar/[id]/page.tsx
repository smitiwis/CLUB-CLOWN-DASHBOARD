import { fetchClientById } from "@/lib/clients/services";
import React from "react";
import FormEditClient from "../../../components/FormEditLead";

type Params = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Params) => {
  const { id } = await params;
  const client = await fetchClientById(id);

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-400 mb-4">
        Actualizar Lead
      </h1>
      <FormEditClient client={client} />
    </>
  );
};

export default Page;
