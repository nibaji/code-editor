import React, { createContext, useEffect, useState } from "react";

import type { TabsContext as TabsContextType } from "../types/TabsContext";
import type { Tab, Tabs } from "../types/misc";

import { storage } from "../constants/misc";

const TabsContext = createContext<TabsContextType>({
  tabs: null,
  setTabs: () => {},
  selectedTabId: null,
  setSelectedTabId: () => {},
});

function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tabs | null>(null);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);

  function saveDataToStorage() {
    if (tabs) {
      localStorage.setItem(storage.tabs, JSON.stringify(tabs));
    }
    if (selectedTabId) {
      localStorage.setItem(storage.selectedTabId, selectedTabId);
    }
  }

  function hydrate() {
    const savedJs = localStorage.getItem(storage.js); // legacy
    if (savedJs) {
      // to set existing input, output to tabs format
      if (savedJs) {
        const id = Date.now().toString();
        const newTab: Tab = {
          id,
          title: "",
          input: savedJs,
          output: "",
          selected: true,
          language: "js",
        };
        const newTabs: Tabs = {
          [id]: newTab,
        };
        localStorage.setItem(storage.tabs, JSON.stringify(newTabs));
        localStorage.removeItem(storage.js); // clear legacy
        setSelectedTabId(id);
      }
      return;
    }
    const storedTabs = localStorage.getItem(storage.tabs) ?? "{}";
    const parsedTabs: Tabs = JSON.parse(storedTabs);
    const storedSelectedTabId = localStorage.getItem(storage.selectedTabId);
    if (Object.keys(parsedTabs).length) {
      setTabs(parsedTabs);
    }
    if (storedSelectedTabId) {
      setSelectedTabId(storedSelectedTabId);
    }
  }

  useEffect(() => {
    saveDataToStorage();
  }, [JSON.stringify(tabs), JSON.stringify(selectedTabId)]);

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <TabsContext.Provider
      value={{ tabs, setTabs, selectedTabId, setSelectedTabId }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export { TabsProvider, TabsContext };
