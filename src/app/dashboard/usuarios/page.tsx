import React from "react";
import { fetchUsuarios } from "@/lib/usuarios/services";
import UsersList from "./components/UsersList";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { permisosPage } from "@/lib/helpers/permisos";

export const dynamic = 'force-dynamic';

const Page = async () => {
  await permisosPage(["admin"]);

  const userList = await fetchUsuarios();

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1>Lista de Usuarios</h1>

        <Button as={Link} color="primary" href="/dashboard/usuarios/crear">
          CREAR USUARIO
        </Button>
      </div>
      <UsersList userList={userList} />
    </>
  );
};

export default Page;
