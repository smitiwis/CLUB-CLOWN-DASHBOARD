import { prisma } from "@/lib/prisma";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Page = async() => {

  const talleres = await prisma.taller.findMany();
  console.log(talleres); 

  return (
    <>
      <Button
        as={Link}
        href="/dashboard/talleres/crear"
        color="primary"
        endContent={<i className="icon-plus" />}
      >
        Nuevo Horario
      </Button>
    </>
  );
};

export default Page;
