import { useEffect, useState } from "react";
import type { Tab as TabType } from "../types/misc";

import { storage } from "../constants/misc";

import "./tab.css";

const Tab = ({
  id,
  isSelected,
  onClick,
  onClose,
}: {
  id: string;
  isSelected: boolean;
  onClick: Function;
  onClose: Function;
}) => {
  const [title, setTitle] = useState("");
  const [tabIsSelected, setTabIsSelected] = useState(isSelected);

  const storedTabs = localStorage.getItem(storage.tabs) ?? "{}";
  const parsedTabs = JSON.parse(storedTabs);

  function handleSelect() {
    setTabIsSelected(true);
    onClick();
  }

  function handleClose() {
    onClose();
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
