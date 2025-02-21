import React from "react";
import FormcreateClient from "../../components/FormCreateLead";

export const dynamic = 'force-dynamic';

const Page = async() => {

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-400 mb-4">Crear Lead</h1>
      <FormcreateClient />
    </>
  );
};

export default Page;
