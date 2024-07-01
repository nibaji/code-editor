import { MouseEvent, useContext, useEffect, useState } from "react";

import { TabsContext } from "../context/tabsContext";

import type { Tab as TabType } from "../types/misc";
import type { Languages } from "../types/languages";

import { languagesMap } from "../constants/languages";

import "./tab.css";

const Tab = ({
  id,
  isSelected,
  onClick,
  onClose,
  onChangeTitle,
  onLanguageChange,
}: {
  id: string;
  isSelected: boolean;
  onClick: Function;
  onClose: Function;
  onChangeTitle: ({ value }: { value: string }) => void;
  onLanguageChange: ({ value }: { value: Languages }) => void;
}) => {
  const { tabs } = useContext(TabsContext);

  const [title, setTitle] = useState("");
  const [tabIsSelected, setTabIsSelected] = useState(isSelected);

  const [language, setLanguage] = useState("");

  const [titleEditMode, setTitleEditMode] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState("");

  const [languageEditMode, setLanguageEditMode] = useState(false);

  function handleTitleChange() {
    onChangeTitle({ value: titleInputValue || title });
    setTitleEditMode(false);
  }

  function handleSelect() {
    setTabIsSelected(true);
    onClick();
  }

  function handleClose(e: MouseEvent) {
    e.stopPropagation();
    onClose();
  }

  useEffect(() => {
    if (tabs) {
      const tab: TabType = tabs[id];
      setTitle(tab?.title || id);
      setLanguage(tab?.language || "js");
    }
  }, []);

  return (
    <div
      className={tabIsSelected ? "tab-selected" : "tab"}
      onClick={handleSelect}
    >
      {/* Title */}
      {!titleEditMode ? (
        <div
          className="tab-title"
          onDoubleClick={() => {
            setTitleEditMode(true);
            setTimeout(() => {
              const inputElement = document.getElementById("tab-title-input");
              inputElement?.focus();
            });
          }}
        >
          {title}
        </div>
      ) : (
        <form onSubmit={handleTitleChange}>
          <input
            id="tab-title-input"
            title="title"
            name="title"
            type="text"
            defaultValue={title}
            maxLength={12}
            placeholder="Title"
            onChange={({ target: { value } }) => setTitleInputValue(value)}
            onBlur={handleTitleChange}
          />
        </form>
      )}
      {/* Language */}
      {!languageEditMode ? (
        <button
          type="button"
          className="info-button"
          onClick={() => setLanguageEditMode(true)}
        >
          {language.toUpperCase()}
        </button>
      ) : (
        <select
          title="language"
          name="language"
          defaultValue={language}
          onChange={({ target: { value } }) => {
            const val = value as Languages;
            onLanguageChange({ value: val });
            setLanguageEditMode(false);
          }}
        >
          {Object.entries(languagesMap).map(([key, value]) => (
            <option value={key}>{value}</option>
          ))}
        </select>
      )}
      {!tabIsSelected && (
        <button type="button" className="error-button" onClick={handleClose}>
          X
        </button>
      )}
    </div>
  );
};

export default Tab;
