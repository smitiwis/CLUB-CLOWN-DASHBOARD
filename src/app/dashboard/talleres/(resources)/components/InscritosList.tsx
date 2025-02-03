/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Key, memo, useCallback, useEffect, useState } from "react";
import { IFInscripcion, IRespInscritos } from "../definitions";
import {
  Chip,
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
import { getColorByStatus, getLabelByStatus } from "@/lib/helpers";
import { format } from "@formkit/tempo";

type Props = {
  tallerId: string;
};

// Función de comparación para React.memo
const areEqual = (prevProps: Props, nextProps: Props) => {
  return (
    JSON.stringify(prevProps.tallerId) === JSON.stringify(nextProps.tallerId)
  );
};

const InscritosList: FC<Props> = memo(({ tallerId }) => {
  // ======== TABLA Y PAGINACION =========
  const [data, setData] = useState<IFInscripcion[]>([]);
  const [loading, setLoading] = useState(false);
  const loadingState = loading ? "loading" : "idle";

  const columns = [
    {
      key: "lista",
      label: "#",
    },
    {
      key: "nombre y apellido",
      label: "NOMBRE y APELLIDO",
    },
    {
      key: "telefono",
      label: "TELEFONO",
    },
    {
      key: "estado",
      label: "PAGO",
    },
    {
      key: "pagoTotal",
      label: "PAGO TOTAL",
    },
    {
      key: "precio_venta",
      label: "PRECIO VENTA",
    },
    {
      key: "fecha_inscripcion",
      label: "FECHA INSCRIPCION",
    },
  ];

  const renderCell = useCallback((item: IFInscripcion, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IFInscripcion];

    switch (columnKey) {
      case "lista":
        return <div>{item.key}</div>;

      case "nombre y apellido":
        return (
          <Tooltip
            closeDelay={0}
            content={`Asesor: ${item.usuario.nombre}`}
            delay={0}
            size="sm"
            color="success"
            placement="right-start"
          >
            <Chip color="primary" variant="light" size="sm">
              {item.nombre} {item.apellido}
            </Chip>
          </Tooltip>
        );

      case "telefono":
        return <div>{item.telefono}</div>;

      case "estado":
        return (
          <Chip
            variant="faded"
            size="sm"
            color={getColorByStatus(item.estado_pago)}
          >
            {getLabelByStatus(item.estado_pago)}
          </Chip>
        );

      case "pagoTotal":
        return <div>S/{item.pagoTotal.toFixed(2)}</div>;

      case "precio_venta":
        return <div>S/{item.precio_venta.toFixed(2)}</div>;

      case "fecha_inscripcion":
        if (item.fecha_inscripcion) {
          return (
            <Tooltip
              className="capitalize"
              color="secondary"
              placement="right-end"
              size="sm"
              content={
                <div className="text-xs">
                  {format(item.fecha_inscripcion, "h:mm a", "es")}
                </div>
              }
            >
              <Chip variant="faded" size="sm">
                {format(item.fecha_inscripcion, "dddd, D MMMM", "es")}
              </Chip>
            </Tooltip>
          );
        }

      default:
        return typeof cellValue === "object"
          ? JSON.stringify(cellValue)
          : cellValue || "-";
    }
  }, []);

  const getInscritosByTallerId = async () => {
    try {
      setLoading(true);
      const getInscritos = await axios.get<IRespInscritos>(
        `/api/taller/${tallerId}/inscritos`
      );
      setData(getInscritos.data.inscritos);
    } catch (error) {
      console.error("Error fetching inscritos:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tallerId) {
      getInscritosByTallerId();
    }
  }, [tallerId]);

  if (!tallerId || tallerId.length === 0) {
    return <p>Id Taller no encontrado</p>;
  }

  return (
    <Table
      // isCompact
      aria-label="Tabla de llamadas"
      selectionMode="none"
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
}, areEqual);

InscritosList.displayName = "InscritosList";

export default InscritosList;
