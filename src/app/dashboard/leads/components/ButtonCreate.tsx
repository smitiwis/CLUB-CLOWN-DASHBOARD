"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const ButtonCreate = () => {
  const router = useRouter();


  const redirectToCreate = () => {
    router.push("/dashboard/leads/create");
  }
  return (
    <Button color="primary" onPress={redirectToCreate}>
      REGISTRAR LEAD
    </Button>
  );
};

export default ButtonCreate;
