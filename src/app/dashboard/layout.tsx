import { FC } from "react";
import HeaderMain from "@/components/header/HeaderMain";
import AsideMain from "@/components/navbar/AsideMain";

interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <div className="grid grid-cols-[256px,1fr] grid-rows-1 h-screen">
      <AsideMain />
      <div className="grid grid-cols-1 grid-rows-[60px,1fr] h-full overflow-y-auto">
        <HeaderMain />
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default RootLayout;
