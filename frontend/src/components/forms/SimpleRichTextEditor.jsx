import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Palette, Type, ChevronDown } from 'lucide-react';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { toArabicNumerals } from '../../utils/numberUtils';

// Custom FontSize extension
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },
});

const Toolbar = ({ editor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const colorPickerRef = useRef(null);
  const sizePickerRef = useRef(null);

  if (!editor) {
    return null;
  }

  const colors = [
    { name: 'أسود', value: '#000000' },
    { name: 'أحمر', value: '#EF4444' },
    { name: 'أزرق', value: '#3B82F6' },
    { name: 'أخضر', value: '#10B981' },
    { name: 'أصفر', value: '#F59E0B' },
    { name: 'بنفسجي', value: '#8B5CF6' },
    { name: 'وردي', value: '#EC4899' },
    { name: 'برتقالي', value: '#F97316' },
  ];



  const textSizes = [
    { label: `صغير جداً (${toArabicNumerals(12)})`, value: '12px', class: 'text-xs' },
    { label: `صغير (${toArabicNumerals(14)})`, value: '14px', class: 'text-sm' },
    { label: `عادي (${toArabicNumerals(16)})`, value: '16px', class: 'text-base' },
    { label: `كبير (${toArabicNumerals(18)})`, value: '18px', class: 'text-lg' },
    { label: `كبير جداً (${toArabicNumerals(20)})`, value: '20px', class: 'text-xl' },
    { label: `عنوان صغير (${toArabicNumerals(24)})`, value: '24px', class: 'text-2xl' },
    { label: `عنوان متوسط (${toArabicNumerals(30)})`, value: '30px', class: 'text-3xl' },
    { label: `عنوان كبير (${toArabicNumerals(36)})`, value: '36px', class: 'text-4xl' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
      if (sizePickerRef.current && !sizePickerRef.current.contains(event.target)) {
        setShowSizePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentColor = editor.getAttributes('textStyle').color || '#000000';

  return (
    <div className="flex items-center gap-2 p-2 border-b border-soft-border bg-gray-50 relative overflow-visible">
      {/* Bold Button */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded transition-colors ${editor.isActive('bold') ? 'bg-brand-purple text-white' : 'hover:bg-gray-200 text-gray-700'
          }`}
        title="عريض"
      >
        <Bold size={18} />
      </button>

      {/* Text Size Picker */}
      <div className="relative" ref={sizePickerRef}>
        <button
          onClick={() => {
            setShowSizePicker(!showSizePicker);
            setShowColorPicker(false);
          }}
          className="flex items-center gap-1 p-2 rounded hover:bg-gray-200 text-gray-700 transition-colors"
          title="حجم النص"
        >
          <Type size={18} />
          <ChevronDown size={14} />
        </button>

        {showSizePicker && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[180px]">
            <div className="p-2 space-y-1">
              {textSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => {
                    editor.chain().focus().setMark('textStyle', { fontSize: size.value }).run();
                    setShowSizePicker(false);
                  }}
                  className={`w-full text-right px-3 py-2 rounded hover:bg-purple-50 transition-colors ${size.class}`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color Picker */}
      <div className="relative" ref={colorPickerRef}>
        <button
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowSizePicker(false);
          }}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 transition-colors"
          title="لون النص"
        >
          <Palette size={18} style={{ color: currentColor }} />
          <div
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: currentColor }}
          />
        </button>

        {showColorPicker && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3 min-w-[200px]">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    editor.chain().focus().setColor(color.value).run();
                    setShowColorPicker(false);
                  }}
                  className="group relative w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-brand-purple transition-all hover:scale-110"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {currentColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full ring-2 ring-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="border-t border-gray-200 pt-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <span>لون مخصص:</span>
                <input
                  type="color"
                  onInput={(event) => {
                    editor.chain().focus().setColor(event.target.value).run();
                  }}
                  value={currentColor}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SimpleRichTextEditor = ({ initialValue, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      FontSize,
      Color,
    ],
    content: initialValue || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-4 text-right',
        dir: 'rtl',
      },
    },
  });

  return (
    <div className="border border-soft-border rounded-lg bg-brand-white text-text-dark overflow-visible">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default SimpleRichTextEditor;
