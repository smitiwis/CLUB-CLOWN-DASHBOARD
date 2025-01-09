/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { FC, Key, useCallback, useEffect, useState } from "react";

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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import IconEye from "@/components/icons/IconEye";
import IconTrash from "@/components/icons/IconTrash";
import IconEdit from "@/components/icons/IconEdit";
import { useRouter } from "next/navigation";
import useDeleteUser from "../hooks/useDeleteUser";

type Props = {
  userList: IUsuarioRes[];
};

const UsersList: FC<Props> = ({ userList }) => {
  const router = useRouter();
  const { goToDelete, state, loading } = useDeleteUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState<IUsuarioTable | null>(null);

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
      key: "rol",
      label: "ROL",
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

      case "fecha_ingreso":
        return format(String(cellValue), "medium");
      
      case "rol":
        return item.rol.nombre;

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
                onPress={() => {
                  onOpen();
                  setUserToDelete(item);
                }}
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

  useEffect(() => {
    if (state?.status === 200) {
      onOpenChange();
    }
  }, [state]);

  return (
    <>
      <Table
        aria-label="Example table with custom cells"
        selectionMode="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            const handleDelete = () => {
              if (userToDelete === null) return;
              goToDelete(userToDelete.id_usuario);
            };
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  ELIMINAR ASCESOR
                </ModalHeader>
                <ModalBody>
                  ¿Estas seguro que quieres eliminar un usuario?
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleDelete}
                    isLoading={loading}
                  >
                    {loading ? "Eliminando" : "Aceptar"}
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UsersList;
