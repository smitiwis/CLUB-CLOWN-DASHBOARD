"use client";

import {
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
  };
}

const HeaderProfile: FC<IUserProfile> = ({ user }) => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{ isBordered: true }}
          className="transition-transform"
          description={user.rolName}
          name={user.name}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="settings">Mi perfil</DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default HeaderProfile;
