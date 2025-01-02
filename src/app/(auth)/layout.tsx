import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;
