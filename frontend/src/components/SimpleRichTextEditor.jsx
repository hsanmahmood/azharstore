import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Palette } from 'lucide-react';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  return (
    <div className="flex items-center p-2 border-b border-soft-border">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
      >
        <Bold size={20} />
      </button>
      <div className="relative">
        <input
          type="color"
          onInput={(event) => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-1 border-none cursor-pointer"
        />
      </div>
    </div>
  );
};

const SimpleRichTextEditor = ({ initialValue, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
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
    <div className="border border-soft-border rounded-lg bg-brand-white text-text-dark">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default SimpleRichTextEditor;
