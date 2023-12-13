import React, { useCallback, useState } from "react";
import Editor from ".";

export const EditorContext = React.createContext();

export default EditorContext;

export function EditorProvider({ children }) {
  const editorRef = React.useRef();
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const forceEditor = useCallback(() => {
    editorRef.current?.querySelector("textarea")?.focus();
    editorRef.current?.scrollIntoView({
      block: "end",
    });
  }, [editorRef]);

  return (
    <EditorContext.Provider
      value={{
        forceEditor,
        content,
        setContent,
        suggestions,
        setSuggestions,
      }}
    >
      {children}
      <Editor ref={editorRef} />
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = React.useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within a EditorProvider");
  }
  return context;
}
