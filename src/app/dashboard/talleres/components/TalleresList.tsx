/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import { IBTallerDataResp, IBTallerResp } from "@/lib/talleres/definicions";
import {
  Button,
  Chip,
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
  Tooltip,
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
  talleresData: IBTallerDataResp;
};

const TalleresList: FC<Props> = ({ talleresData }) => {
  const router = useRouter();
  const columns = [
    {
      key: "nombre",
      label: "NOMBRE",
    },
    {
      key: "profesor",
      label: "PROFESOR",
    },
    {
      key: "dias",
      label: "DIAS",
    },
    {
      key: "hora",
      label: "HORA",
    },
    {
      key: "precio",
      label: "PRECIO",
    },
    {
      key: "cant_clases",
      label: "DURACION",
    },
    {
      key: "estado",
      label: "ESTADO",
    },

    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: IBTallerResp, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IBTallerResp];

    switch (columnKey) {
      case "profesor":
        return (
          <div>
            {item.profesor.nombre} {item.profesor.apellidos}
          </div>
        );

      case "dias":
        return (
          <div className="flex gap-x-2">
            {item.dias.map((dia) => (
              <Chip
                color="success"
                variant="dot"
                size="sm"
                key={dia}
                className="text-small"
              >
                {dia}
              </Chip>
            ))}
          </div>
        );

      case "precio":
        return <div>S/. {String(cellValue)}</div>;

      case "cant_clases":
        return <div>{String(cellValue)} sesiones</div>;

      case "estado":
        const isActive = parseInt(item.estado);
        return (
          <Chip
            className="flex items-center"
            variant="flat"
            color={isActive ? "success" : "danger"}
          >
            {isActive ? "Activo" : "Inactivo"}
          </Chip>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-x-2">
            <Tooltip content="Detalles" color="success">
              <Button
                isIconOnly
                color="success"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/llamada/detalle/${item.id_taller}`)
                }
              >
                <IconEye />
              </Button>
            </Tooltip>

            <Tooltip content="Editar" color="default">
              <Button
                isIconOnly
                color="success"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/llamada/editar/${item.id_taller}`)
                }
              >
                <span className="transform rotate-[30deg]">
                  <IconEdit />
                </span>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return typeof cellValue === "object"
          ? JSON.stringify(cellValue)
          : cellValue || "-";
    }
  }, []);

  // ======== TABLA Y PAGINACION =========
  const [data, setData] = useState(talleresData.data); // Usamos la lista inicial
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState(talleresData.pagination);
  const limit = pagination.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  const loadingState = isLoading ? "loading" : "idle";

  const fetchPageData = async () => {
    setIsLoading(true);

    try {
      const path = `/api/taller/list?page=${page}&limit=${limit}`;
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
            href="/dashboard/talleres/crear"
            color="primary"
            endContent={<i className="icon-plus" />}
          >
            CREAR TALLER
          </Button>
        </div>
        <div className="flex justify-between items-end my-2">
          <span className="text-default-400 text-small">
            Total {pagination.total} clientes
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
    if (page === 1) {
      return setData(talleresData.data);
    }
    fetchPageData();
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

export default TalleresList;
