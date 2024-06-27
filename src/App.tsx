import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

import Tab from "./components/Tab";

import { storage } from "./constants/misc";

import type { Tab as TabType, Tabs } from "./types/misc";

import * as nightOwl from "monaco-themes/themes/Night Owl.json";
import "./App.css";

function App() {
  const [tabs, setTabs] = useState<Tabs | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType | null>(null);

  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  function setInputOutPut({
    input,
    output,
  }: {
    input: string;
    output: string;
  }) {
    if (selectedTab?.id) {
      const updatedTab = {
        ...selectedTab,
        input,
        output,
      };
      const updatedTabs: Tabs = {
        ...tabs,
        [selectedTab.id]: updatedTab,
      };
      localStorage.setItem(storage.tabs, JSON.stringify(updatedTabs));
      setTabs(updatedTabs);
    }
  }

  let logs: any[] = [];
  console.log = function (...messages) {
    logs.push(messages);
    const messageArray = logs.map((e) => JSON.stringify(e));

    let tempOut = "";
    for (const message of messageArray) {
      console.info(message);

      if (message) {
        tempOut +=
          `${tempOut ? "\n" : ""}` + message.substring(1, message.length - 1);
      }
    }
    setOutput(tempOut);
  };

  const onChange = React.useCallback(
    (value: string | undefined) => {
      if (value && selectedTab?.id) {
        setInput(value);
      }
    },
    [tabs, selectedTab]
  );

  const onRun = () => {
    if (input) {
      try {
        const snippet = new Function(input);
        snippet();
      } catch (error) {
        console.info({ error });
      }
    }
  };

  const onClearOutput = () => setOutput("");

  const onClearAll = () => {
    setInput("");
    setOutput("");
  };

  function scrollToTab() {
    const element = document.getElementsByClassName("tab-selected")?.[0];
    element?.scrollIntoView({
      block: "end",
    });
  }

  function handleAddTab() {
    const id = Date.now().toString();
    const newTab: TabType = {
      id,
      selected: true,
      input: "",
      output: "",
      title: "",
    };
    setTabs({ ...tabs, [id]: newTab });
    setSelectedTab(newTab);
    scrollToTab();
  }

  function handleTabClose(tab: TabType) {
    const storedTabs = localStorage.getItem(storage.tabs) ?? "{}";
    const parsedTabs: Tabs = JSON.parse(storedTabs);
    const storedSelectedTabId = localStorage.getItem(storage.selectedTabId);
    if (
      Object.entries(parsedTabs).length > 1 &&
      storedSelectedTabId !== tab.id
    ) {
      delete parsedTabs[tab.id];
      localStorage.setItem(storage.tabs, JSON.stringify(parsedTabs));
      setTabs(parsedTabs);
    }
  }

  function handleTabClick(tab: TabType) {
    setSelectedTab(tab);
  }

  useEffect(() => {
    setInputOutPut({ input, output });
  }, [input, output]);

  useEffect(() => {
    if (tabs) {
      localStorage.setItem(storage.tabs, JSON.stringify(tabs));
    }
  }, [JSON.stringify(tabs ?? {})]);

  useEffect(() => {
    if (selectedTab) {
      setInput(selectedTab?.input ?? "");
      setOutput(selectedTab?.output ?? "");
      localStorage.setItem(storage.selectedTabId, selectedTab?.id ?? "");
    }
    setTimeout(() => {
      scrollToTab();
    }, 500);
  }, [JSON.stringify(selectedTab ?? {})]);

  useEffect(() => {
    const storedTabs = localStorage.getItem(storage.tabs) ?? "{}";
    const parsedTabs: Tabs = JSON.parse(storedTabs);
    if (Object.keys(parsedTabs).length) {
      setTabs(parsedTabs);
      const storedSelectedTabId = localStorage.getItem(storage.selectedTabId);
      if (storedSelectedTabId) {
        setSelectedTab(parsedTabs[storedSelectedTabId] ?? null);
      } else {
        const theSelectedTab = Object.values(parsedTabs).find(
          (tab) => tab.selected
        );
        setSelectedTab(theSelectedTab ?? null);
      }
    } else {
      handleAddTab();
    }
  }, []);

  useEffect(() => {
    // legacy
    // to set existing input, output to tabs format
    const savedJs = localStorage.getItem(storage.js);
    if (savedJs) {
      const id = Date.now().toString();
      const newTab: TabType = {
        id,
        title: "",
        input: savedJs,
        output: "",
        selected: true,
      };
      const newTabs: Tabs = {
        [id]: newTab,
      };
      localStorage.setItem(storage.tabs, JSON.stringify(newTabs));
      localStorage.removeItem(storage.js); // clear legacy
      setInput(savedJs);
    }
  }, []);

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
                key={tab.id + selectedTab?.id}
                id={tab.id}
                isSelected={tab.id == selectedTab?.id}
                onClick={() => handleTabClick(tab)}
                onClose={() => handleTabClose(tab)}
              />
            ))}
          </div>
          <button type="button" onClick={handleAddTab}>
            +
          </button>
        </div>
      )}
      <Editor
        language="javascript"
        height="60vh"
        onChange={onChange}
        value={input}
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
        value={output}
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
