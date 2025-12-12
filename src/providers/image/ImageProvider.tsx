"use client";

import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";

import { imageContext } from "./imageContext";

import { fileToBase64 } from "@/lib/utils";
import { errorContext } from "../error";
import { setupContext } from "../setup";

export const ImageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { handleShowMessageError } = useContext(errorContext);
  const { apiKey } = useContext(setupContext);

  const handleImageChange = (file: File | null) => {
    setFile(file);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setCompletion("");
  };

  useEffect(() => {
    async function run() {
      if (file === null) return;
      if (!apiKey) {
        handleShowMessageError("Please set your API Key in the setup.");
        return;
      }

      setIsLoading(true);
      setCompletion("");

      try {
        const image = await fileToBase64(file);

        const response = await fetch("/api/translate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image, apiKey }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          handleShowMessageError(data.message || "Failed to extract text");
          return;
        }

        setCompletion(data.text);
      } catch (err) {
        handleShowMessageError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    }

    run();
  }, [file, apiKey, handleShowMessageError]);

  return (
    <imageContext.Provider
      value={{
        handleImageChange,
        handleRemoveImage,
        completion,
        isLoading,
        file,
      }}
    >
      {children}
    </imageContext.Provider>
  );
};
