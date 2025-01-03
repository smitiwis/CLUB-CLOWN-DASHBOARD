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

interface IUser {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const HeaderProfile: FC<IUser> = ({ user }) => {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{ isBordered: true }}
          className="transition-transform"
          description="Admin"
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
