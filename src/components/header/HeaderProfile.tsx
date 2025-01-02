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
    name: string;
    email: string;
    image: string;
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
          description="@tonyreichert"
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
