import React from "react";
import { fetchUserById } from "@/lib/usuarios/services";
import FormEditUser from "../../components/FormEditUser";
import { fetchRoles } from "@/lib/roles/services";

type Params = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: Params) => {
  const { id } = await params;

  const usuario = await fetchUserById(id);

    const getRoles = await fetchRoles();
  
    const roles = getRoles.map(({ id_rol, nombre, estado }, i) => ({
      key: i,
      rolId: id_rol,
      label: nombre,
      estado: !!parseInt(estado),
    }));


  if (!usuario) {
    return <div>Usuario no encontrado</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-400 mb-4">
        Editar Usuario
      </h1>
      <FormEditUser usuario={usuario} roles={roles} />
    </>
  );
};

export default Page;