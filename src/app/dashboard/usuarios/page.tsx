import React from "react";
import { fetchUsuarios } from "@/lib/usuarios/services";
import UsersList from "./components/UsersList";
import { Button, Link } from "@nextui-org/react";

const Page = async () => {
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
