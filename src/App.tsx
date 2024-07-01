import React, { useContext, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

import Tab from "./components/Tab";

import { TabsContext } from "./context/tabsContext";

import languages from "./languages";

import { languagesMap } from "./constants/languages";

import type { Tab as TabType } from "./types/misc";
import type { Languages } from "./types/languages";

import * as nightOwl from "monaco-themes/themes/Night Owl.json";
import "./App.css";

function App() {
  const { tabs, setTabs, selectedTabId, setSelectedTabId } =
    useContext(TabsContext);

  const [selectedTab, setSelectedTab] = useState<TabType | null>(null);

  function setValue({ key, value }: { key: string; value?: string | boolean }) {
    if (selectedTab?.id) {
      const updatedTab = {
        ...selectedTab,
        [key]: value,
      };
      setSelectedTab(updatedTab);
    }
  }

  function setInputOutput({
    input,
    output,
  }: {
    input?: string;
    output?: string;
  }) {
    setValue({ key: "input", value: input ?? selectedTab?.input });
    setValue({ key: "output", value: output ?? selectedTab?.output });
  }

  const onChange = React.useCallback(
    (value: string | undefined) => {
      if (value && selectedTab?.id) {
        setSelectedTab({
          ...selectedTab,
          input: value,
        });
      }
    },
    [tabs, selectedTab]
  );

  const onRun = () => {
    if (selectedTab?.input && selectedTab.language) {
      const theFn = languages[selectedTab.language];
      const theOut = theFn(selectedTab.input);
      setInputOutput({
        output: theOut ?? "",
      });
    }
  };

  const onClearOutput = () => {
    setInputOutput({ output: "" });
  };

  const onClearAll = () => {
    setInputOutput({ input: "", output: "" });
  };

  const onLanguageChange = (language: Languages) => {
    setValue({ key: "language", value: language });
  };

  function scrollToTab() {
    const element = document.getElementsByClassName("tab-selected")?.[0];
    element?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  function changeTabTitle(title: string) {
    setValue({ key: "title", value: title });
  }

  function handleAddTab() {
    const id = Date.now().toString();
    const newTab: TabType = {
      id,
      selected: true,
      input: "",
      output: "",
      title: "",
      language: "js",
    };
    setTabs({ ...tabs, [id]: newTab });
    setSelectedTabId(id);
    scrollToTab();
  }

  function handleTabClose(tab: TabType) {
    if (Object.entries(tabs ?? {}).length > 1 && selectedTabId !== tab.id) {
      const updatedTabs = { ...tabs };
      delete updatedTabs[tab?.id];
      setTabs(updatedTabs);
    }
  }

  function handleTabClick(tab: TabType) {
    setSelectedTabId(tab.id);
  }

  useEffect(() => {
    if (selectedTab) {
      setTabs({ ...tabs, [selectedTab.id]: { ...selectedTab } });
      setTimeout(() => {
        scrollToTab();
      }, 500);
    }
  }, [JSON.stringify(selectedTab ?? {})]);

  useEffect(() => {
    if (tabs) {
      if (selectedTabId) {
        setSelectedTab(tabs[selectedTabId] ?? null);
      } else {
        const theSelectedTab = Object.values(tabs).find((tab) => tab.selected);
        setSelectedTab(theSelectedTab ?? null);
      }
    } else {
      handleAddTab();
    }
  }, [selectedTabId, JSON.stringify(tabs ?? {})]);

  return (
    <div className="App">
      <header className="App-header">
        JS Code Editor
        <button onClick={onClearAll} className="error-button">
          Clear All X
        </button>
        <button onClick={onRun}>Run {"</>"}</button>
      </header>

      {tabs && (
        <div className="tabs-add-btn-holder">
          <div className="tabs">
            {Object.values(tabs).map((tab) => (
              <Tab
                key={
                  tab.id +
                  String(selectedTab?.id === tab.id) +
                  tab.title +
                  tab.language
                }
                id={tab.id}
                isSelected={tab.id == selectedTab?.id}
                onClick={() => handleTabClick(tab)}
                onClose={() => handleTabClose(tab)}
                onChangeTitle={({ value }) => changeTabTitle(value)}
                onLanguageChange={({ value }) => onLanguageChange(value)}
              />
            ))}
          </div>
          <button type="button" onClick={handleAddTab}>
            +
          </button>
        </div>
      )}
      <Editor
        language={
          selectedTab ? languagesMap[selectedTab.language] : "javascript"
        }
        height="60vh"
        onChange={onChange}
        value={selectedTab?.input}
        onMount={(_editor, monaco) => {
          monaco.editor.defineTheme("night-owl", nightOwl as any);
          monaco.editor.setTheme("night-owl");
        }}
        options={{
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
      />
      <div className="console-heading-holder">
        <h5>Console Log</h5>
        <button onClick={onClearOutput} className="error-button">
          Clear Console X
        </button>
      </div>
      {/* <pre>{output}</pre> */}
      <Editor
        language="powershell"
        value={selectedTab?.output}
        height="30vh"
        loading
        options={{
          readOnly: true,
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
      />
    </div>
  );
}

export default App;
