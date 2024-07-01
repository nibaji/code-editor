import { Languages } from "./languages";

export interface Tab {
  id: string;
  title?: string;
  input?: string;
  output?: string;
  selected: boolean;
  language: Languages;
}

export type Tabs = {
  [id: string]: Tab;
};
