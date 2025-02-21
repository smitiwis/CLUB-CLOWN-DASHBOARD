/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import { COLORES, RESULTADO_LLAMADAS, TIPO_LLAMADAS } from "@/constants";
import { IBCallsResp, IBClientCallRes } from "@/lib/llamadas/definitions";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  FC,
  Key,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  callsData: IBCallsResp;
};

const CallsList: FC<Props> = ({ callsData }) => {
  const router = useRouter();
  const rows = callsData.data;

  const columns = [
    {
      key: "cliente",
      label: "LEAD",
    },
    {
      key: "estado",
      label: "COLOR",
    },
    {
      key: "observacion",
      label: "OBSERVACION",
    },
    {
      key: "tipo",
      label: "TIPO",
    },
    {
      key: "resultado",
      label: "RESULTADO",
    },
    {
      key: "fecha_creacion",
      label: "FECHA REGISTRO",
    },

    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: IBClientCallRes, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IBClientCallRes];

    switch (columnKey) {
      case "cliente":
        return (
          <div className="flex flex-col">
            <span className="text-small">{item.cliente.nombre}</span>
            <span className="text-small">{item.cliente.telefono}</span>
          </div>
        );
      case "estado":
        const color = COLORES.find((color) => color.key === cellValue);
        return (
          <div
            className="w-[.5rem] h-[.5rem] rounded-full"
            style={{ background: color?.code || "white" }}
          />
        );

      case "tipo":
        return (
          <div className="flex flex-col">
            <span className="text-small">
              {TIPO_LLAMADAS.find((tipo) => tipo.key === cellValue)?.label}
            </span>
          </div>
        );

      case "resultado":
        return (
          <div className="flex flex-col">
            <span className="text-small">
              {RESULTADO_LLAMADAS.find((res) => res.key === cellValue)?.label}
            </span>
          </div>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-x-2">
            <Button
              isIconOnly
              color="success"
              variant="light"
              size="sm"
              onPress={() =>
                router.push(
                  `/dashboard/llamada/detalle/${item.id_cliente_llamada}`
                )
              }
            >
              <IconEye />
            </Button>

            <Button
              isIconOnly
              color="success"
              variant="light"
              size="sm"
              onPress={() =>
                router.push(
                  `/dashboard/llamada/editar/${item.id_cliente_llamada}`
                )
              }
            >
              <span className="transform rotate-[30deg]">
                <IconEdit />
              </span>
            </Button>
          </div>
        );
      default:
        return typeof cellValue === "object"
          ? JSON.stringify(cellValue)
          : cellValue || "-";
    }
  }, []);

  // ======== TABLA Y PAGINACION =========
  const [isFirtsRender, setIsFirtsRender] = useState(true);
  const [data, setData] = useState(rows); // Usamos la lista inicial
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: callsData.pagination.page,
    limit: callsData.pagination.limit,
    total: callsData.pagination.total,
    totalPages: callsData.pagination.totalPages,
  });

  const limit = callsData.pagination.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  const loadingState = isLoading ? "loading" : "idle";

  const fetchPageData = async () => {
    setIsLoading(true);

    try {
      const path = `/api/llamada/list?page=${page}&limit=${limit}`;
      const response = await axios.get(path);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-y-1">
        <div className="flex justify-end gap-3">
          <Button
            as={Link}
            href="/dashboard/llamar/registrar"
            color="primary"
            endContent={<i className="icon-plus" />}
          >
            Registrar llamada
          </Button>
        </div>
        <div className="flex justify-between items-end my-2">
          <span className="text-default-400 text-small">
            Total {data.length} clientes
          </span>
          <label className="flex gap-x-2 items-center text-default-400 text-small">
            <span>Filas por pagina:</span>
            <div className="w-[70px]">
              <Select
                defaultSelectedKeys={[String(limit)]}
                size="sm"
                items={[
                  { label: "5", key: "5" },
                  { label: "10", key: "10" },
                  { label: "15", key: "15" },
                ]}
              >
                {(document) => (
                  <SelectItem key={document.key} textValue={document.label}>
                    <div className="flex flex-col">
                      <span className="text-small">{document.label}</span>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </div>
          </label>
        </div>
      </div>
    );
  }, [data.length]);

  const bottomContent = React.useMemo(() => {
    if (pagination.totalPages === 1 || !data.length) return null;
    return (
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pagination.page}
          total={pagination.totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>
    );
  }, [pages, pagination]);

  useEffect(() => {
    if (!isFirtsRender) fetchPageData();
    else setIsFirtsRender(false);
  }, [page]);

  return (
    <Table
      topContent={topContent}
      aria-label="Tabla de llamadas"
      selectionMode="none"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>

      <TableBody
        items={data || []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
        emptyContent={"No hay registros para mostrar"}
      >
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

export default CallsList;
