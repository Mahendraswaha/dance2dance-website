import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, Unlink, List, ListOrdered, Heading1, Heading2, AlignLeft, AlignCenter } from 'lucide-react';
import React, { useEffect } from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link (inclua http:// ou https://):', previousUrl || '');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#222222] bg-[#1a1a1f] rounded-t-lg">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222]'}`}
        title="Negrito"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222]'}`}
        title="Itálico"
      >
        <Italic size={16} />
      </button>
      
      <div className="w-px h-5 bg-[#333] mx-1"></div>
      
      <button
        type="button"
        onClick={setLink}
        className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222]'}`}
        title="Inserir Link"
      >
        <LinkIcon size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className={`p-1.5 rounded transition-colors ${!editor.isActive('link') ? 'opacity-30 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-[#222]'}`}
        title="Remover Link"
      >
        <Unlink size={16} />
      </button>

      <div className="w-px h-5 bg-[#333] mx-1"></div>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded transition-colors font-bold text-xs ${editor.isActive('heading', { level: 2 }) ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222]'}`}
        title="Título Principal"
      >
        H1
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222]'}`}
        title="Lista"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222]'}`}
        title="Lista Numerada"
      >
        <ListOrdered size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: 'color: #C9A84C; text-decoration: underline;'
        }
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        className: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[300px] p-6 text-zinc-300 [&_p]:my-2 [&_a]:text-accent [&_a]:no-underline hover:[&_a]:underline'
      }
    }
  });

  // Keep editor synced if value changes externally (like clicking a different template)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Store current cursor position to prevent jumping
      const { from, to } = editor.state.selection;
      editor.commands.setContent(value, false);
      // Try to restore cursor position if it's within bounds
      try {
        editor.commands.setTextSelection({ from, to });
      } catch (e) {
        // Ignore if position is invalid after content change
      }
    }
  }, [value, editor]);

  return (
    <div className="border border-[#333333] rounded-lg bg-[#0A0A0E] overflow-hidden flex flex-col focus-within:border-accent/50 transition-colors">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto max-h-[500px]">
        <EditorContent editor={editor} />
      </div>
      <div className="bg-[#1a1a1f] px-4 py-2 border-t border-[#222222] text-xs text-zinc-500 flex justify-between">
        <span>Você pode usar variáveis como {'{{userName}}'} e {'{{workshopName}}'} livremente no texto.</span>
      </div>
    </div>
  );
}
