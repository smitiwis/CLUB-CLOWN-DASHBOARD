import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <Button as={Link} href="/dashboard/inscripciones/registrar">
      Inscribir nuevo alumno
    </Button>
  );
};

export default Page;
