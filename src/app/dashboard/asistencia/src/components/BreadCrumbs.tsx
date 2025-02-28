"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import React from "react";

const BreadCrumbs = () => {
  return (
    <Breadcrumbs size="lg">
      <BreadcrumbItem>Dashboard</BreadcrumbItem>
      <BreadcrumbItem>Asistencia</BreadcrumbItem>
      <BreadcrumbItem>Taller</BreadcrumbItem>
    </Breadcrumbs>
  );
};

export default BreadCrumbs;
