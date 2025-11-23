import React, { useState, useRef } from 'react';
import { Bold, Plus, Minus, Palette } from 'lucide-react';

const SimpleRichTextEditor = ({ initialValue, onChange }) => {
  const [content, setContent] = useState(initialValue || '');
  const [showColorPalette, setShowColorPalette] = useState(false);
  const editorRef = useRef(null);
  let currentFontSize = 3; // Corresponds to <font size="3">

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080'
  ];

  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const changeFontSize = (direction) => {
    currentFontSize = direction === 'increase' ? Math.min(7, currentFontSize + 1) : Math.max(1, currentFontSize - 1);
    applyStyle('fontSize', currentFontSize);
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
          onClick={() => applyStyle('bold')}
          className="p-2 rounded hover:bg-black/20 focus:outline-none"
        >
          <Bold size={20} />
        </button>
        <button
          type="button"
          onClick={() => changeFontSize('increase')}
          className="p-2 rounded hover:bg-black/20 focus:outline-none"
        >
          <Plus size={20} />
        </button>
        <button
          type="button"
          onClick={() => changeFontSize('decrease')}
          className="p-2 rounded hover:bg-black/20 focus:outline-none"
        >
          <Minus size={20} />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPalette(!showColorPalette)}
            className="p-2 rounded hover:bg-black/20 focus:outline-none"
          >
            <Palette size={20} />
          </button>
          {showColorPalette && (
            <div className="absolute z-10 grid grid-cols-5 gap-2 p-2 bg-black/30 border border-brand-border rounded-lg">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    applyStyle('foreColor', color);
                    setShowColorPalette(false);
                  }}
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: content }}
        className="w-full h-48 p-2 resize-y overflow-auto focus:outline-none"
        style={{ fontFamily: 'Tajawal, sans-serif' }}
      />
    </div>
  );
};

export default SimpleRichTextEditor;
