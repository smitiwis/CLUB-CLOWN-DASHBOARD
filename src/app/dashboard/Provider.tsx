import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <HeroUIProvider>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
}
