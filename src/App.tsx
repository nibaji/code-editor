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

  const storedTabs = localStorage.getItem(storage.tabs);
  const parsedTabs: Tabs = JSON.parse(storedTabs || "");
  const storedSelectedTabId = localStorage.getItem(storage.selectedTabId);

  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

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

  const onChange = React.useCallback((value: string | undefined) => {
    if (value) {
      setInput(value);
      localStorage.setItem(storage.js, value);
    }
  }, []);

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

  function handleTabClick(tab: TabType) {
    setSelectedTab(tab);
  }

  useEffect(() => {
    setInput(selectedTab?.input ?? "");
    setOutput(selectedTab?.output ?? "");
    localStorage.setItem(storage.selectedTabId, selectedTab?.id ?? "");
  }, [JSON.stringify(selectedTab)]);

  useEffect(() => {
    if (parsedTabs) {
      setTabs(parsedTabs);
      if (storedSelectedTabId) {
        setSelectedTab(parsedTabs[storedSelectedTabId] ?? null);
      } else {
        const theSelectedTab = Object.values(parsedTabs).find(
          (tab) => tab.selected
        );
        setSelectedTab(theSelectedTab ?? null);
      }
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
        <div>
          {Object.values(tabs).map((tab) => (
            <Tab
              id={tab.id}
              isSelected={tab.selected}
              callback={() => {
                handleTabClick(tab);
              }}
            />
          ))}
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
