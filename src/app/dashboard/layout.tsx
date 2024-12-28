import AsideMain from "@/components/navbar/AsideMain";
import { FC } from "react";


interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <AsideMain />
      <main className="p-8 flex-1">{children}</main>
    </div>
  );
};

export default RootLayout;
