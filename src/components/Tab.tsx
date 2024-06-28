import {
  FormEvent,
  FormEventHandler,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import type { Tab as TabType } from "../types/misc";

import { storage } from "../constants/misc";

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
  const [title, setTitle] = useState("");
  const [tabIsSelected, setTabIsSelected] = useState(isSelected);

  const [titleEditMode, setTitleEditMode] = useState(false);
  const [titleInputValue, setTitleInputValue] = useState("");

  const storedTabs = localStorage.getItem(storage.tabs) ?? "{}";
  const parsedTabs = JSON.parse(storedTabs);

  function handleTitleChange() {
    onChangeTitle({ value: titleInputValue.replace(" ", "") || title });
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
    if (parsedTabs) {
      const tab: TabType = parsedTabs[id];
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
            onChange={({ target: { value } }) =>
              setTitleInputValue(value.replace(" ", ""))
            }
            onBlur={handleTitleChange}
          />
        </form>
      )}
      <button type="button" className="error-button" onClick={handleClose}>
        X
      </button>
    </div>
  );
};

export default Tab;
