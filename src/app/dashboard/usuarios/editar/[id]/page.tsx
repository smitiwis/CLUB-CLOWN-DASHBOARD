import React from "react";
import { fetchUserById } from "@/lib/usuarios/services";
import FormEditUser from "../../components/FormEditUser";

type Params = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Params) => {
  const { id } = await params;

  const usuario = await fetchUserById(id);

  if (!usuario) {
    return <div>Usuario no encontrado</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-400 mb-4">
        Editar Usuario
      </h1>
      <FormEditUser usuario={usuario} />
    </>
  );
};

export default Page;