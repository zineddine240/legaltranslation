"use client";

import { PropsWithChildren, FC, useEffect, useContext, useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { textContext } from "./textContext";
import {
  DEBOUNCE_TIME,
  MAX_TEXT_TO_TRANSLATE_LENGTH,
  MIN_TEXT_TO_TRANSLATE_LENGTH,
  SearchParams,
} from "@/lib/constants";
import { languageContext } from "@/providers/language";
import { errorContext } from "@/providers/error";

export const HfTextProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialText = searchParams.get(SearchParams.TEXT) ?? "";
  const [textToTranslateState, setTextToTranslateState] = useState(initialText);
  const [completion, setCompletion] = useState("");
  const [client, setClient] = useState<any>(null);

  const { handleShowMessageError } = useContext(errorContext);
  const { fromLanguage, toLanguage } = useContext(languageContext);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const mod: any = await import("@gradio/client");
        const connected = await mod.Client.connect("3ltranslate/legaltranslator");
        if (isMounted) setClient(connected);
      } catch (err) {
        handleShowMessageError("Failed to connect to Hugging Face Space.");
      }
    })();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateWithHF = useMemo(() => {
    return async (text: string) => {
      if (!client) return;
      try {
        const result = await client.predict("/predict", { text });
        // result.data is expected to be the translated string
        const output = Array.isArray(result?.data) ? result.data[0] : (result as any)?.data;
        if (typeof output === "string") {
          setCompletion(output);
        } else if (output != null) {
          setCompletion(String(output));
        } else {
          setCompletion("");
        }
      } catch (err: any) {
        handleShowMessageError(err?.message || "Hugging Face translation failed");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const handleDebouncedTextChange = useDebouncedCallback((value: string) => {
    // Note: HF model does not take languages; we keep UI consistent
    translateWithHF(value);
  }, DEBOUNCE_TIME);

  const setTextToTranslate = (value: string) => {
    setTextToTranslateState(value);
    const newSearchParams = new URLSearchParams(searchParams);
    if (value.trim().length) {
      newSearchParams.set(SearchParams.TEXT, value);
    } else {
      newSearchParams.delete(SearchParams.TEXT);
    }
    const queryString = newSearchParams.toString();
    router.replace(`${pathname}?${queryString}`);
  };

  const handleSetTextToTranslate = (value: string) => {
    setTextToTranslateState(value);
  };

  const handleChangeTextToTranslate = (textToTranslate: string) => {
    if (textToTranslate.trim().length > MAX_TEXT_TO_TRANSLATE_LENGTH) return;
    setTextToTranslate(textToTranslate);
    if (textToTranslate.trim().length < MIN_TEXT_TO_TRANSLATE_LENGTH) {
      return setCompletion("");
    }
    handleDebouncedTextChange(textToTranslate);
  };

  useEffect(() => {
    if (textToTranslateState.trim().length < MIN_TEXT_TO_TRANSLATE_LENGTH) return;
    // trigger immediate translation when languages change or initial load
    translateWithHF(textToTranslateState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromLanguage, toLanguage]);

  return (
    <textContext.Provider
      value={{
        completion,
        textToTranslate: textToTranslateState,
        handleChangeTextToTranslate,
        handleSetTextToTranslate,
      }}
    >
      {children}
    </textContext.Provider>
  );
};


