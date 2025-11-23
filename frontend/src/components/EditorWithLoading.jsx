import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Loader2 } from 'lucide-react';

const EditorWithLoading = ({ apiKey, onInit, initialValue, init, ...props }) => {
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);

  const handleInit = (evt, editor) => {
    editorRef.current = editor;
    setLoading(false);
    if (onInit) {
      onInit(evt, editor);
    }
  };

  return (
    <div className="relative border border-brand-border rounded-lg">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 border border-brand-border rounded-lg z-10">
          <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
      )}
      <Editor
        apiKey={apiKey}
        onInit={handleInit}
        initialValue={initialValue}
        init={{
          ...init,
          setup: (editor) => {
            if (init.setup) {
              init.setup(editor);
            }
          },
        }}
        {...props}
      />
    </div>
  );
};

export default EditorWithLoading;
