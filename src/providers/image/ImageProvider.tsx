"use client";

import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";

import { imageContext } from "./imageContext";

import { fileToBase64 } from "@/lib/utils";
import { errorContext } from "../error";
// On n'a plus besoin d'importer setupContext car on n'utilise plus la clé API
// import { setupContext } from "../setup"; 

export const ImageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { handleShowMessageError } = useContext(errorContext);
  // On ignore la clé API du setup
  // const { apiKey } = useContext(setupContext);

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

      // --- MODIFICATION ICI ---
      // J'ai supprimé le bloc qui bloquait si pas de clé API.
      // Le code passe directement à la suite.

      setIsLoading(true);
      setCompletion("");

      try {
        const image = await fileToBase64(file);

        // On appelle ton route.ts (qui lui appelle Render)
        const response = await fetch("/api/translate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // On n'envoie plus "apiKey" car ton backend Python ne l'utilise pas
          body: JSON.stringify({ image }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          // Affiche l'erreur qui vient potentiellement de Python ou du réseau
          handleShowMessageError(data.message || "Failed to extract text");
          return;
        }

        // On récupère le texte renvoyé par ton backend Render
        // Assure-toi que ton Python renvoie bien un champ nommé "text" ou adapte ici (ex: data.result)
        setCompletion(data.text);
      } catch (err) {
        handleShowMessageError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    }

    run();
  }, [file, handleShowMessageError]); // J'ai retiré 'apiKey' des dépendances ici aussi

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