import React, { useCallback, useEffect, useState } from "react";
import { MentionIdentityUser } from "@osn/common-ui";
import RichEditor from "@osn/common-ui/es/RichEditor";
import { useEditorContext } from "./context";

function Editor({}, ref) {
  const [loading, setLoading] = useState(false);
  const { content, setContent, suggestions } = useEditorContext();

  const loadSuggestions = (text) => {
    return suggestions.filter((i) =>
      i.address.toLowerCase().includes(text.toLowerCase()),
    );
  };

  const onSubmit = useCallback(() => {}, []);

  return (
    <div className="mt-[16px]">
      <RichEditor
        ref={ref}
        content={content}
        setContent={setContent}
        onSubmit={onSubmit}
        showButtons={true}
        submitButtonName="Comment"
        submitting={loading}
        loadSuggestions={loadSuggestions}
        identifier={<MentionIdentityUser hashRoute target="_blank" />}
      />
    </div>
  );
}

export default React.forwardRef(Editor);
