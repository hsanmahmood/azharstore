import React, { useState, useRef } from 'react';
import { Bold } from 'lucide-react';

const SimpleRichTextEditor = ({ initialValue, onChange }) => {
  const [content, setContent] = useState(initialValue || '');
  const editorRef = useRef(null);

  const handleBoldClick = () => {
    document.execCommand('bold', false, null);
    editorRef.current.focus();
  };

  const handleContentChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  return (
    <div className="border border-brand-border rounded-lg">
      <div className="flex items-center p-2 border-b border-brand-border">
        <button
          type="button"
          onClick={handleBoldClick}
          className="p-2 rounded hover:bg-black/20 focus:outline-none"
        >
          <Bold size={20} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: content }}
        className="w-full h-48 p-2 resize-y overflow-auto focus:outline-none"
      />
    </div>
  );
};

export default SimpleRichTextEditor;
