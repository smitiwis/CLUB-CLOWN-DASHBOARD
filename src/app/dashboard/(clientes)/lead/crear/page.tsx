import React from "react";
import FormcreateClient from "../../components/FormCreateLead";

const Page = () => {
  const path = process.env.NEXT_PATH_DOC;
  const token = process.env.NEXT_TOKEN_DOC;
  console.log({ path, token });
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-400 mb-4">Crear Lead</h1>
      <FormcreateClient />
    </>
  );
};

export default Page;
