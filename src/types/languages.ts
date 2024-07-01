export type Languages = "js" | "ts";

export type LanguageOutputProcessors = {
  [key in Languages]: (input: string) => string;
};

export type LanguagesMap = {
  [key in Languages]: string;
};
