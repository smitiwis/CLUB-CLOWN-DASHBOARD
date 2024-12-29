"use client";

import React, { FC, Key, useCallback } from "react";

import { IUsuarioRes, IUsuarioTable } from "@/lib/usuarios/definicions";
import { format } from "@formkit/tempo";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import IconEye from "@/components/icons/IconEye";
import IconTrash from "@/components/icons/IconTrash";
import IconEdit from "@/components/icons/IconEdit";

type Props = {
  userList: IUsuarioRes[];
};

const UsersList: FC<Props> = ({ userList }) => {
  const rows = userList.map((user, i) => {
    return {
      ...user,
      key: String(i + 1),
    };
  });
  
  const columns = [
    {
      key: "nombre",
      label: "NOMBRE",
    },
    {
      key: "dni",
      label: "DNI",
    },
    {
      key: "correo",
      label: "CORREO",
    },
    {
      key: "estado",
      label: "ESTADO",
    },
    {
      key: "fecha_ingreso",
      label: "FEC. INGRESO",
    },
    {
      key: "telefono",
      label: "TELEFONO",
    },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: IUsuarioTable, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IUsuarioTable];

    switch (columnKey) {
      case "estado":
        return (
          <div
            className="flex items-center"
            style={{
              color: item.estado === "activo" ? "green" : "red",
            }}
          >
            {item.estado}
          </div>
        );

      case "fecha_ingreso":
        return format(cellValue as Date, "medium");

      case "actions":
        return (
          <div className="flex justify-center">
            <Tooltip content="Ver">
              <IconEye />
            </Tooltip>
            <Tooltip content="Editar">
              <IconEdit />
            </Tooltip>
            <Tooltip content="Eliminar">
              <IconTrash />
            </Tooltip>
          </div>
        );

      default:
        return String(cellValue) || "-";
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

export default UsersList;
