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
  Button,
} from "@nextui-org/react";
import { IBClientRes, IFClientTable } from "@/lib/clients/definitions";
import { COLORES, GROUPS_CLIENT } from "@/constants";
import { useRouter } from "next/navigation";
import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import IconPhone from "@/components/icons/IconPhone";

type Props = {
  clientsList: IBClientRes[];
};

const ClientsList: FC<Props> = ({ clientsList }) => {
  const router = useRouter();
  const rows: IFClientTable[] = clientsList.map((lead, i) => ({
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
        const color = COLORES.find((color) => color.key === cellValue);
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

      case "grupo":
        const grupo = GROUPS_CLIENT.find((group) => group.key === cellValue);
        return (
          <div className="flex flex-col">
            <span className="text-small">{grupo?.label}</span>
          </div>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-x-2">
            <Tooltip content="Llamar" color="primary">
              <Button
                isIconOnly
                color="primary"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/llamar/${item.id_cliente}/registrar`)
                }
              >
                <IconPhone />
              </Button>
            </Tooltip>
            
            <Tooltip content="Detalles" color="success">
              <Button
                isIconOnly
                color="success"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/lead/detalle/${item.id_cliente}`)
                }
              >
                <IconEye />
              </Button>
            </Tooltip>

            <Tooltip content="Editar" >
              <Button
                isIconOnly
                color="success"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/lead/editar/${item.id_cliente}`)
                }
              >
                <IconEdit />
              </Button>
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

export default ClientsList;
