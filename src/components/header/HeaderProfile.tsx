"use client";

import { IUserProfile } from "@/lib/definitions";
import {
  Badge,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { signOut } from "next-auth/react";
import React, { FC } from "react";

const HeaderProfile: FC<IUserProfile> = ({ user }) => {
  const { name, rolName, callsPending } = user;

  return (
    <div className="text-lg flex gap-x-4 items-center cursor-pointer">
      <Dropdown placement="bottom-end" backdrop="blur">
        <DropdownTrigger>
          <div className="flex items-center gap-x-4">
            <Badge
              color="danger"
              placement="top-left"
              content={callsPending || ""}
            >
              <User
                as="button"
                avatarProps={{ isBordered: true }}
                className="transition-transform"
                description={rolName}
                name={name}
              />
            </Badge>
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="Mi perfil">Mi perfil</DropdownItem>
          <DropdownItem key="Pendientes">
            <div className="flex items-center ga-x-2">
              <span>Llamadas pendiente</span>
              <Chip size="lg" color="danger" variant="light">
                <span className="font-bold">{callsPending}</span>
              </Chip>
            </div>
          </DropdownItem>
          <DropdownItem
            key="Cerrar sesion"
            color="danger"
            onPress={() => signOut()}
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default HeaderProfile;
