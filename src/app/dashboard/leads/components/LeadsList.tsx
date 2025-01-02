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
import { IBClientRes, IFClientTable } from "@/lib/leads/definitions";
import PhoneIcon from "@/components/icons/IconPhone";
import IconPhone from "@/components/icons/IconTrash";
import IconEye from "@/components/icons/IconEye";
import { COLORES } from "@/constants";

type Props = {
  leadsList: IBClientRes[];
};

const LeadsList: FC<Props> = ({ leadsList }) => {
  const rows: IFClientTable[] = leadsList.map((lead, i) => ({
    ...lead,
    key: String(i + 1),
  }));

  const columns = [
    {
      key: "estado",
      label: "COLOR",
    },
    {
      key: "telefono",
      label: "CELULAR",
    },
    {
      key: "nombre",
      label: "NOMBRE",
    },
    {
      key: "apellido",
      label: "APELLIDO",
    },
    {
      key: "edad",
      label: "EDAD",
    },
    {
      key: "grupo",
      label: "GRUPO",
    },
 
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: IFClientTable, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IFClientTable];

    switch (columnKey) {
      case "estado":
        const color = COLORES.find((color) => parseInt(color.key) === cellValue);
        return (
          <div
            className="w-[.5rem] h-[.5rem] rounded-full"
            style={{ background: color?.code || "white" }}
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
