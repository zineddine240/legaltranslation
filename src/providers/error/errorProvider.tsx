"use client";

import { FC, PropsWithChildren, useContext } from "react";

import { errorContext } from "./errorContext";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { setupContext } from "../setup";

export const ErrorProvider: FC<PropsWithChildren> = ({ children }) => {
  const { handleOpenSetupDialog } = useContext(setupContext);

  const handleShowMessageError = (response: string) => {
    let message = response;

    try {
      const parsed = JSON.parse(response);
      message = parsed.message || response;
    } catch {
      // If parsing fails, use the response as the message
    }

    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: message,
      action: (
        <ToastAction onClick={handleOpenSetupDialog} altText="Try again">
          Configure
        </ToastAction>
      ),
    });
  };

  return (
    <errorContext.Provider value={{ handleShowMessageError }}>
      {children}
    </errorContext.Provider>
  );
};
