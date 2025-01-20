import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Page = () => {
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
