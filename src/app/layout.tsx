import type { Metadata } from "next";
import "./globals.css";
import "../icons/styles.css";

import { FC } from "react";
import SessionProviderWrapper from "../components/session/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" className="dark">
      <body className={`dark text-foreground bg-background antialiased`}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
