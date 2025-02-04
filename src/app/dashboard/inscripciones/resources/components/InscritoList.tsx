/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { FC, Key, useCallback, useMemo, useState } from "react";
import { IBInscripcion, IBInscripcionResponse } from "../definitions";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Chip,
  Input,
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
import IconEye from "@/components/icons/IconEye";
import IconEdit from "@/components/icons/IconEdit";
import Link from "next/link";
import { REGEX } from "@/constants/regex";
import debounce from "debounce";
import axios from "axios";
import {
  formatearNombre,
  formatPhoneNumber,
  getColorByStatus,
  getLabelByStatus,
} from "@/lib/helpers";

type Props = {
  inscripcionesResp: IBInscripcionResponse;
};
const InscritoList: FC<Props> = ({ inscripcionesResp }) => {
  console.log("inscripcionesResp", inscripcionesResp);
  const router = useRouter();
  const rows = inscripcionesResp.data;

  const columns = [
    {
      key: "key",
      label: "#",
    },
    {
      key: "nombre",
      label: "NOMBRE Y APELL",
    },
    {
      key: "telefono",
      label: "TELÉFONO",
    },
    {
      key: "estado",
      label: "ESTADO",
    },

    {
      key: "precioVenta",
      label: "PRECIO VENTA",
    },
    {
      key: "pagos",
      label: "PAGO TOTAL",
    },
    {
      key: "restante",
      label: "RESTANTE",
    },
    {
      key: "estadoPago",
      label: "PAGO",
    },

    {
      key: "promocion",
      label: "PROMOCIÓN",
    },
    {
      key: "taller",
      label: "TALLER",
    },
    {
      key: "observacion",
      label: "OBSERVACIONES",
    },

    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: IBInscripcion, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IBInscripcion];
    const totalPagos = item.pagos.reduce((acc, pago) => acc + pago.monto, 0);

    switch (columnKey) {
      case "nombre":
        return (
          <Chip avatar={<Avatar />} variant="flat" size="sm">
            {formatearNombre(item.nombre, 25)}
          </Chip>
        );

      case "telefono":
        return (
          <div className="flex items-center gap-x-2">
            {formatPhoneNumber(item.telefono)}
          </div>
        );

      case "estado":
        const isActive = parseInt(item.estado);
        return (
          <Chip
            className="flex items-center"
            variant="flat"
            size="md"
            color={isActive ? "success" : "danger"}
          >
            {isActive ? "Activo" : "Inactivo"}
          </Chip>
        );

      case "precioVenta":
        return (
          <div className="flex justify-end items-center gap-x-2 mr-3">
            S/{item.precioVenta.toFixed(2)}
          </div>
        );

      case "pagos":
        return (
          <div className="flex justify-end items-center gap-x-2 mr-3">
            S/{totalPagos.toFixed(2)}
          </div>
        );

      case "restante":
        const restante = item.precioVenta - totalPagos;

        return (
          <div className="flex justify-end items-center gap-x-2 mr-3">
            S/{restante.toFixed(2)}
          </div>
        );

      case "estadoPago":
        return (
          <Chip
            variant="faded"
            size="sm"
            color={getColorByStatus(item.estadoPago)}
            onClick={() => console.log("PRESS")}
            className="cursor-pointer"
            startContent={<IconEye size={18} color={"white"} />}
          >
            {getLabelByStatus(item.estadoPago)}
          </Chip>
        );

      case "promocion":
        return item.promocion?.nombre || "-";

      case "taller":
        return (
          <Tooltip
            content={`Precio: S/${item.taller.precio.toFixed(2)}`}
            showArrow
            color="success"
            placement="right-end"
          >
            <Chip variant="light">{item.taller?.nombre || "-"}</Chip>
          </Tooltip>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-x-2">
            <Button
              isIconOnly
              color="success"
              variant="light"
              size="sm"
              onPress={() => router.push(`/dashboard/pago/detalle/${item.id}`)}
            >
              <IconEye />
            </Button>

            <Button
              isIconOnly
              color="success"
              variant="light"
              size="sm"
              onPress={() => router.push(`/dashboard/pago/editar/${item.id}`)}
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

  const fetchPageData = async (text?: string, init?: boolean) => {
    setIsLoading(true);
    try {
      const base = `/api/inscrito/list?page=${
        init ? "1" : page
      }&limit=${limit}`;
      const path = `${base}${text ? `&phoneNumber=${text}` : ""}`;

      const response = await axios.get<IBInscripcionResponse>(path);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ======== TABLA Y PAGINACION =========
  const [data, setData] = useState(rows); // Usamos la lista inicial
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState(inscripcionesResp.pagination);
  const limit = pagination.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  // ======== FILTROS =========
  const [errorPhone, setErrorPhone] = useState(false);
  const [filterPhone, setFilterPhone] = useState("");

  const onSearchChange = useCallback(
    debounce((text: string) => {
      if (!REGEX.PHONE.test(text)) setErrorPhone(true);
      if (!text) setErrorPhone(false);

      if (pagination.total > pagination.limit) {
        fetchPageData(text, true);
      }
    }, 1000),
    []
  );

  const loadingState = isLoading ? "loading" : "idle";

  const onClear = React.useCallback(() => {
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-y-1">
        <div className="flex justify-between gap-3">
          <Input
            size="lg"
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por celular..."
            startContent={<i className="icon-search" />}
            onClear={onClear}
            isInvalid={errorPhone}
            errorMessage={errorPhone ? "Ingrese un número válido" : ""}
            onValueChange={(text) => {
              setFilterPhone(text);
              setErrorPhone(false);
              onSearchChange(text);
            }}
          />
          <Button
            as={Link}
            href="/dashboard/inscripciones/registrar"
            color="primary"
            endContent={<i className="icon-plus" />}
            size="lg"
          >
            INSCRIBIR ALUMNO
          </Button>
        </div>
        <div className="flex justify-between items-end my-2">
          <span className="text-default-400 text-small">
            Total {data.length} pagos registrados
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
  }, [filterPhone, errorPhone, data.length, onSearchChange]);

  const bottomContent = useMemo(() => {
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
  return (
    <Table
      topContent={topContent}
      aria-label="Tabla de pagos"
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

export default InscritoList;
