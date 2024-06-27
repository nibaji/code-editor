export interface Tab {
  id: string;
  title?: string;
  input?: string;
  output?: string;
  selected: boolean;
}

export type Tabs = {
  [id: string]: Tab;
};
