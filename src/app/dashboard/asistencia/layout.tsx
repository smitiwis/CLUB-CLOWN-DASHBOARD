import { FC } from "react";
import BreadCrumbs from "./src/components/BreadCrumbs";

interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col h-full" aria-hidden="false">
      <BreadCrumbs />
      {children}
    </div>
  );
};

export default RootLayout;
