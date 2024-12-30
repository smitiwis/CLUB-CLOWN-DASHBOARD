/* eslint-disable react-hooks/exhaustive-deps */
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
  Chip,
  Button,
} from "@nextui-org/react";
import IconEye from "@/components/icons/IconEye";
import IconTrash from "@/components/icons/IconTrash";
import IconEdit from "@/components/icons/IconEdit";
import { useRouter } from "next/navigation";

type Props = {
  userList: IUsuarioRes[];
};

const UsersList: FC<Props> = ({ userList }) => {
  const router = useRouter();

  const rows = userList.map((user, i) => ({ ...user, key: String(i + 1) }));

  const columns = [
    {
      key: "nombre",
      label: "NOMBRE",
    },
    {
      key: "apellido",
      label: "APELLIDO",
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
          <Chip
            className="flex items-center"
            variant="flat"
            color={item.estado ? "success" : "danger"}
          >
            {item.estado ? "Activo" : "Inactivo"}
          </Chip>
        );

      case "fecha_ingreso":
        return format(String(cellValue), "medium");

      case "actions":
        return (
          <div className="relative flex items-center">
            <Tooltip content="Detalles" color="success">
              <Button
                onPress={() => console.log("detalles")}
                isIconOnly
                color="success"
                variant="light"
              >
                <IconEye />
              </Button>
            </Tooltip>
            <Tooltip content="Editar">
              <Button
                onPress={() => handleEdit(item)}
                isIconOnly
                variant="light"
              >
                <IconEdit />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar">
              <Button
                onPress={() => console.log("Eliminar")}
                isIconOnly
                color="danger"
                variant="light"
              >
                <IconTrash />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return String(cellValue) || "-";
    }
  }, []);

  const handleEdit = (item: IUsuarioTable) => {
    router.push(`/dashboard/usuarios/editar/${item.id_usuario}`);
  };

  return (
    <Table aria-label="Example table with custom cells" selectionMode="single">
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
