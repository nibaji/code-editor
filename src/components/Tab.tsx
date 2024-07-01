import { MouseEvent, useContext, useEffect, useState } from "react";

import { TabsContext } from "../context/tabsContext";

import type { Tab as TabType } from "../types/misc";

import "./tab.css";

const Tab = ({
  id,
  isSelected,
  onClick,
  onClose,
  onChangeTitle,
}: {
  id: string;
  isSelected: boolean;
  onClick: Function;
  onClose: Function;
  onChangeTitle: ({ value }: { value: string }) => void;
}) => {
  const { tabs } = useContext(TabsContext);

  const [title, setTitle] = useState("");
  const [tabIsSelected, setTabIsSelected] = useState(isSelected);

  const [titleEditMode, setTitleEditMode] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState("");

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
    }
  }, []);

  return (
    <div
      className={tabIsSelected ? "tab-selected" : "tab"}
      onClick={handleSelect}
    >
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
      {!tabIsSelected && (
        <button type="button" className="error-button" onClick={handleClose}>
          X
        </button>
      )}
    </div>
  );
};

export default Tab;
