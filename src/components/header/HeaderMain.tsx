import { User } from "@nextui-org/react";
import React from "react";

const HeaderMain = () => {
  return (
    <div className="bg-gray-900 h-full py-3 px-6 flex justify-end items-center border-b-1 border-gray-700">
      <User
        avatarProps={{
          src: "",
        }}
        description="Product Designer"
        name="Jane Doe"
      />
    </div>
  );
};

export default HeaderMain;
