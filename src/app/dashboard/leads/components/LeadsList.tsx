"use client";

import React, { FC, Key, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import { ILead } from "@/lib/leads/definitions";
import { format } from "@formkit/tempo";
import PhoneIcon from "@/components/icons/IconPhone";
import IconPhone from "@/components/icons/IconTrash";
import IconEye from "@/components/icons/IconEye";
import { COLORES } from "@/constants";

type Props = {
  leadsList: ILead[];
};

const LeadsList: FC<Props> = ({ leadsList }) => {
  const rows = leadsList.map((lead, i) => {
    return {
      ...lead,
      fecha_inicio_taller: lead.fecha_inicio_taller
        ? format(lead.fecha_inicio_taller, "medium")
        : "-",
      key: String(i + 1),
    };
  });
  const columns = [
    {
      key: "color",
      label: "",
    },
    {
      key: "celular_contacto",
      label: "CELULAR",
    },
    {
      key: "nombre_contacto",
      label: "NOMBRE",
    },
    {
      key: "status",
      label: "STATUS",
    },
    {
      key: "categoria_contacto",
      label: "CATEGORIA",
    },
    {
      key: "edad_contacto",
      label: "EDAD",
    },
    {
      key: "grupo_horario",
      label: "HORARIO",
    },
    {
      key: "fecha_inicio_taller",
      label: "INICIO TALLER",
    },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: ILead, columnKey: Key) => {
    const cellValue = item[columnKey as keyof ILead];

    switch (columnKey) {
      case "color":
        const color = COLORES.find((color) => color.key === cellValue);
        return (
          <div
            className="w-[.5rem] h-[.5rem] rounded-full"
            style={{ background: color?.code || "#696969" }}
          />
        );
      case "status":
        return (
            <div className="flex flex-col">
              <span className="text-small">{cellValue}</span>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Llamar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <PhoneIcon />
              </span>
            </Tooltip>
            <Tooltip content="Editar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <IconEye />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <IconPhone />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue || "-";
    }
  }, []);

  return (
    <Table aria-label="Example static collection table" selectionMode="single">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>

      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LeadsList;
