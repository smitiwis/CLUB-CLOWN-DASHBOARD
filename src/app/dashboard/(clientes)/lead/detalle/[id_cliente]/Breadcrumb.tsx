"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import React from "react";

const Breadcrumb = () => {
  return (
    <Breadcrumbs className="mb-6" size="lg">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/leads">Leads</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/lead/detalle">Detalle</BreadcrumbItem>
    </Breadcrumbs>
  );
};

export default Breadcrumb;
