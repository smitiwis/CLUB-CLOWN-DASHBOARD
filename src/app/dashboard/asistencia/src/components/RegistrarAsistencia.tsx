"use client";

import React, { FC, Key, useCallback, useState } from "react";
import { IBAlumnosAsistencia } from "../definicions";
import { format, diffDays } from "@formkit/tempo";
import axios from "axios";
import {
  Checkbox,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";

type Props = {
  fetchAlumnos: IBAlumnosAsistencia[];
};

function isToDay(fecha: Date): boolean {
  const hoy = new Date();
  // Establecer la hora a 0 para comparar solo la fecha
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  // Si la diferencia en días es 0, la fecha es hoy
  return diffDays(hoy, fecha) === 0;
}

function getColumns(alumnos: IBAlumnosAsistencia[]) {
  const fechasMap: {
    [fecha: string]: {
      key: string;
      label: string;
      fecha: Date;
    };
  } = {};

  alumnos.forEach((alumno) => {
    alumno.asistencias.forEach((asistencia) => {
      const fechaLabel = format(asistencia.fecha_asistencia, "DD/MM/YYYY");
      if (!fechasMap[fechaLabel]) {
        fechasMap[fechaLabel] = {
          key: isToDay(asistencia.fecha_asistencia) ? "HOY" : fechaLabel,
          label: isToDay(asistencia.fecha_asistencia) ? "HOY" : fechaLabel,
          fecha: asistencia.fecha_asistencia,
        };
      }
    });
  });

  const hasToDay = Object.values(fechasMap).find(
    (fecha) => fecha.label === "HOY"
  );

  if (!hasToDay) {
    const today = new Date();
    fechasMap["HOY"] = {
      key: format(today, "DD/MM/YYYY"),
      label: "HOY",
      fecha: today,
    };
  }

  return [...Object.values(fechasMap)].sort(
    (a, b) => a.fecha.getTime() - b.fecha.getTime()
  );
}

const rellenarDatos = (
  fetchAlumnos: IBAlumnosAsistencia[],
  columns: {
    key: string;
    label: string;
    fecha: Date;
  }[]
) => {
  return fetchAlumnos.map((alumno) => {
    return {
      ...alumno,
      asistencias: columns.map((column) => {
        const fechaAsistencia = alumno.asistencias.find((asistencia) => {
          const { fecha_asistencia } = asistencia;
          const fechaAsistencia = format(fecha_asistencia, "DD/MM/YYYY");
          const fechaColum = format(column.fecha, "DD/MM/YYYY");
          return fechaAsistencia === fechaColum;
        });

        return (
          fechaAsistencia || {
            id_asistencia: "",
            fecha_asistencia: new Date("1991-11-15"),
            estado: "",
          }
        );
      }),
    };
  });
};

const RegistrarAsistencia: FC<Props> = ({ fetchAlumnos }) => {
  const [columns] = useState(getColumns(fetchAlumnos));
  const [data] = useState(rellenarDatos(fetchAlumnos, columns)); // Usamos la lista inicial

  const handleCheck = async (checked: boolean, clientId: string) => {
    try {
      await axios.post(
        "/api/asistencia/registrar",
        { clientId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  // ========= TABLA Y PAGINACION =========

  const renderCell = useCallback(
    (item: IBAlumnosAsistencia, columnKey: Key) => {
      const algo = item.asistencias.find((asistencia) => {
        const isHoy = isToDay(asistencia.fecha_asistencia)
          ? "HOY"
          : format(asistencia.fecha_asistencia, "DD/MM/YYYY");
        return isHoy === columnKey;
      });

      switch (columnKey) {
        case "0":
          return (
            <div className="flex items-center gap-x-1">
              <span className="text-gray-300">{item.index}</span>
              <Tooltip
                placement="right-end"
                color={item.deuda > 0 ? "warning" : "default"}
                delay={500}
                content={item.deuda > 0 && <b>S/{item.deuda.toFixed(2)}</b>}
                isDisabled={item.deuda === 0}
              >
                <Chip
                  variant="light"
                  color={item.deuda > 0 ? "warning" : "success"}
                  size="sm"
                >
                  {item.nombre} {item.apellido}
                </Chip>
              </Tooltip>
            </div>
          );

        case "HOY":
          return (
            <Checkbox
              color="success"
              size="lg"
              defaultSelected={algo?.estado === "1"}
              onValueChange={(checked) => {
                handleCheck(checked, item.id_cliente);
              }}
            />
          );

        default:
          const miColumnKey = columnKey as string;
          const [day, month, year] = miColumnKey.split("/").map(Number);
          const fecha = new Date(year, month - 1, day);

          if (!algo && !isToDay(fecha)) return "-";

          return (
            <Checkbox
              color="success"
              size="lg"
              isReadOnly={!isToDay(fecha)}
              defaultSelected={algo?.estado === "1"}
              onValueChange={(checked) => {
                handleCheck(checked, item.id_cliente);
              }}
            />
          );
      }
    },
    []
  );

  const classNames = React.useMemo(
    () => ({
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        // middle
        "group-data-[middle=true]/tr:before:rounded-none",
        // last
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <div className="w-full">
      <Table
        selectionMode="single"
        // topContent={topContent}
        aria-label="Tabla de pagos"
        // bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={classNames}
      >
        <TableHeader
          columns={[{ key: "0", label: "NOMBRES Y APELLIDOS" }, ...columns]}
        >
          {(column) => (
            <TableColumn className="text-md text-gray-300" key={column.key}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={data || []}
          loadingContent={<Spinner />}
          // loadingState={loadingState}
          emptyContent={"No hay registros para mostrar"}
        >
          {(item) => (
            <TableRow key={item.id_cliente}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegistrarAsistencia;
