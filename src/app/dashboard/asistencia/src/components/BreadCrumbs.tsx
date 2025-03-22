"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const BreadCrumbs = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Breadcrumbs size="lg">
      <BreadcrumbItem onClick={() => router.push("/dashboard")}>
        Dashboard
      </BreadcrumbItem>
      <BreadcrumbItem
        isCurrent={pathname === "/dashboard/asistencia"}
        onClick={() => router.push("/dashboard/asistencia")}
      >
        Asistencia
      </BreadcrumbItem>
      {pathname.includes("taller") && (
        <BreadcrumbItem isCurrent={pathname.includes("taller")}>
          Taller
        </BreadcrumbItem>
      )}
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
