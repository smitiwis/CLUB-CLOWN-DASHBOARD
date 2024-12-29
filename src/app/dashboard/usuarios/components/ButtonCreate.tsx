"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const ButtonCreateUser = () => {
  const router = useRouter();


  const redirectToCreate = () => {
    router.push("/dashboard/usuarios/create");
  }
  return (
    <Button color="primary" onPress={redirectToCreate}>
      CREAR USUARIO
    </Button>
  );
};

export default ButtonCreateUser;
