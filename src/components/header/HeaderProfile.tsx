"use client";

import {
  Badge,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import React, { FC } from "react";

interface IUserProfile {
  user: {
    name: string;
    rolName: string;
    callsPending: number;
  };
}

const HeaderProfile: FC<IUserProfile> = ({ user }) => {
  const { name, rolName, callsPending } = user;

  return (
    <div className="text-lg flex gap-x-4 items-center cursor-pointer">
      <Badge color="danger" content={callsPending}>
        <i className="icon-bell-o" />
      </Badge>

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{ isBordered: true }}
            className="transition-transform"
            description={rolName}
            name={name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="settings">Mi perfil</DropdownItem>
          <DropdownItem key="settings">
            <div className="flex items-center ga-x-2">
              <span>Llamadas pendiente</span>
              <Chip size="lg" color="danger" variant="light">
                <span className="font-bold">{callsPending}</span>
              </Chip>
            </div>
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default HeaderProfile;
