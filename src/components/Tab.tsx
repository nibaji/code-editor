import { useEffect, useState } from "react";
import type { Tab as TabType } from "../types/misc";

import { storage } from "../constants/misc";

import "./tab.css";

const Tab = ({
  id,
  isSelected,
  callback,
}: {
  id: string;
  isSelected: boolean;
  callback: Function;
}) => {
  const [title, setTitle] = useState("");
  const [tabIsSelected, setTabIsSelected] = useState(isSelected);

  const tabs = localStorage.getItem(storage.tabs);
  const parsedTabs = JSON.parse(tabs ?? "");

  function handleSelect() {
    setTabIsSelected(true);
    callback();
  }

  function handleClose() {
    if (tabs) {
      if (Object.entries(parsedTabs).length > 1) {
        setTabIsSelected(false);
        delete parsedTabs[id];
        localStorage.setItem(storage.tabs, JSON.stringify(parsedTabs));
      }
    }
  }

  useEffect(() => {
    if (parsedTabs) {
      const tab: TabType = parsedTabs[id];
      setTitle(tab?.title || id);
    }
  }, []);

  return (
    <div className={tabIsSelected ? "tab-selected" : "tab"}>
      <div className="tab-title" onClick={handleSelect}>
        {title}
      </div>
      <button type="button" className="error-button" onClick={handleClose}>
        X
      </button>
    </div>
  );
};

export default Tab;
