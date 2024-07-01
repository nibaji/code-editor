import type { Tabs } from "./misc";

export type TabsContext = {
  tabs: Tabs | null;
  setTabs: Function;
  selectedTabId: string | null;
  setSelectedTabId: Function;
};
