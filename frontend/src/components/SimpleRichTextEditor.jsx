import React, { useState, useRef, useEffect } from 'react';
import { Bold, Plus, Minus, Palette } from 'lucide-react';
import ColorPicker from './jscolorpicker/colorpicker.js';
import './jscolorpicker/colorpicker.css';

const SimpleRichTextEditor = ({ initialValue, onChange }) => {
  const [content, setContent] = useState(initialValue || '');
  const editorRef = useRef(null);
  const colorPickerRef = useRef(null);
  let currentFontSize = 3;

  useEffect(() => {
    return () => {
      if (colorPickerRef.current) {
        colorPickerRef.current.destroy();
      }
    };
  }, []);

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

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  const openColorPicker = () => {
    if (colorPickerRef.current) {
      colorPickerRef.current.destroy();
    }
    const picker = new ColorPicker({
      target: editorRef.current,
      headless: true,
    });
    picker.on('pick', (color) => {
      applyStyle('foreColor', color.hex);
    });
    picker.open();
    colorPickerRef.current = picker;
  };

  return (
    <div className="border border-brand-border rounded-lg">
      <div className="flex items-center p-2 border-b border-brand-border">
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onClick={() => applyStyle('bold')}
          className="p-2 rounded hover:bg-black/20 focus:outline-none"
        >
          <Bold size={20} />
        </button>
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onClick={() => changeFontSize('increase')}
          className="p-2 rounded hover:bg-black/20 focus:outline-none"
        >
          <Plus size={20} />
        </button>
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onClick={() => changeFontSize('decrease')}
          className="p-2 rounded hover:bg-black/20 focus:outline-none"
        >
          <Minus size={20} />
        </button>
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onClick={openColorPicker}
          className="p-2 rounded hover:bg-black/20 focus:outline-none"
        >
          <Palette size={20} />
        </button>
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
