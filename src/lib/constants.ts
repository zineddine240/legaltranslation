import { SpeakingState } from "@/interfaces";

export const enum ToolBeltType {
  TEXT = "text",
  IMAGE = "image",
  DOCUMENT = "document",
  WEB_SITE = "web-site",
}

export const validToolBeltTypes = [
  ToolBeltType.TEXT,
  ToolBeltType.IMAGE,
  ToolBeltType.DOCUMENT,
  ToolBeltType.WEB_SITE,
];

export const DEFAULT_FROM_QUERY_LANGUAGE = "fr";
export const DEFAULT_TO_QUERY_LANGUAGE = "ar";

interface Language {
  value: string;
  label: string;
  lang: string;
  query: string;
}

export const languages: Language[] = [
  { value: "French", label: "French", lang: "fr-FR", query: "fr" },
  { value: "Arabic", label: "Arabic", lang: "ar-SA", query: "ar" },
];

export const querylanguages: string[] = languages.map(({ query }) => query);

export const languageByValue: Record<string, Language> = languages.reduce(
  (acc, language) => ({
    ...acc,
    [language.value]: language,
  }),
  {}
);

export const languageByQueryLanguage: Record<string, Language> =
  languages.reduce(
    (acc, language) => ({
      ...acc,
      [language.query]: language,
    }),
    {}
  );

export const DEFAULT_LANG = "fr-FR";

export const DEBOUNCE_TIME = 300;

export const enum TranslationBoxTypes {
  SOURCE = "source",
  TARGET = "target",
}

export const MIN_TEXT_TO_TRANSLATE_LENGTH = 2;
export const MAX_TEXT_TO_TRANSLATE_LENGTH = 5000;

export const defaultSpeakingState: SpeakingState = {
  isSpeaking: false,
  type: TranslationBoxTypes.SOURCE,
};

export const DEFAULT_TOOLTIP_DELAY_DURATION = 600;

export const enum SearchParams {
  FROM_LANGUAGE = "sl",
  TO_LANGUAGE = "tl",
  OPTION = "op",
  TEXT = "text",
}

export const validPrefixes = [
  "data:application/pdf;base64,",
  "data:@file/pdf;base64,",
];