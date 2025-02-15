/* eslint-disable react-hooks/exhaustive-deps */
// SessionHandler.tsx
"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      const now = Date.now();
      const sessionExpiry = new Date(session.expires).getTime();
      const timeRemaining = sessionExpiry - now;

      if (timeRemaining > 0) {
        const timeoutId = setTimeout(() => {
          onOpen();
        }, timeRemaining);

        return () => clearTimeout(timeoutId);
      } else {
        onOpen();
      }
    }
  }, [session, status]);

  return (
    <>
      {children}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={() => {
          signOut();
          onOpenChange();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-x-2 justify-center items-center text-warning-500">
                <i className="icon-exclamation-triangle text-3xl"></i>
                <span className="text-1xl">SU SESIÓN HA EXPIRADO</span>
              </ModalHeader>
              <ModalFooter>
                <Button
                  size="lg"
                  color="danger"
                  variant="light"
                  className="mx-auto border border-danger"
                  onPress={() => {
                    signOut();
                    onClose();
                  }}
                >
                  <span className="font-semibold">OK!</span>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SessionHandler;
