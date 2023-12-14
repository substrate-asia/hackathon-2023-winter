import React, { useCallback, useState } from "react";
import { MentionIdentityUser } from "@osn/common-ui";
import RichEditor from "@osn/common-ui/es/RichEditor";
import { useEditorContext } from "./context";
import { useDispatch } from "react-redux";
import { newErrorToast } from "@/store/reducers/toastSlice";

function Editor({ onSubmit: _onSubmit = noop }, ref) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { content, setContent, suggestions } = useEditorContext();

  const loadSuggestions = (text) => {
    return suggestions.filter((i) =>
      i.address.toLowerCase().includes(text.toLowerCase()),
    );
  };

  const onSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await _onSubmit(content);
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setLoading(false);
      setContent("");
    }
  }, [dispatch, _onSubmit, content]);

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
