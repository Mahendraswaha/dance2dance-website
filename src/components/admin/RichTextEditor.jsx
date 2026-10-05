import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, Unlink, List, ListOrdered, Heading1, Heading2, AlignLeft, AlignCenter, Code } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const MenuBar = ({ editor, isRawMode, toggleRawMode }) => {
  const setLink = () => {
    if (!editor || isRawMode) return;
    try {
      const previousUrl = editor.getAttributes('link')?.href || '';
      const url = window.prompt('URL do link (inclua http:// ou https://):', previousUrl);

      if (url === null) return;

      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#222222] bg-[#1a1a1f] rounded-t-lg justify-between">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={isRawMode}
          className={`p-1.5 rounded transition-colors ${editor?.isActive('bold') && !isRawMode ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222] disabled:opacity-50'}`}
          title="Negrito"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={isRawMode}
          className={`p-1.5 rounded transition-colors ${editor?.isActive('italic') && !isRawMode ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222] disabled:opacity-50'}`}
          title="Itálico"
        >
          <Italic size={16} />
        </button>
        
        <div className="w-px h-5 bg-[#333] mx-1"></div>
        
        <button
          type="button"
          onClick={setLink}
          disabled={isRawMode}
          className={`p-1.5 rounded transition-colors ${editor?.isActive('link') && !isRawMode ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222] disabled:opacity-50'}`}
          title="Inserir Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().unsetLink().run()}
          disabled={!editor?.isActive('link') || isRawMode}
          className={`p-1.5 rounded transition-colors ${!editor?.isActive('link') || isRawMode ? 'opacity-30 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-[#222]'}`}
          title="Remover Link"
        >
          <Unlink size={16} />
        </button>

        <div className="w-px h-5 bg-[#333] mx-1"></div>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={isRawMode}
          className={`px-2 py-1 rounded transition-colors font-bold text-xs ${editor?.isActive('heading', { level: 2 }) && !isRawMode ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222] disabled:opacity-50'}`}
          title="Título Principal"
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={isRawMode}
          className={`p-1.5 rounded transition-colors ${editor?.isActive('bulletList') && !isRawMode ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222] disabled:opacity-50'}`}
          title="Lista"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={isRawMode}
          className={`p-1.5 rounded transition-colors ${editor?.isActive('orderedList') && !isRawMode ? 'bg-accent/20 text-accent' : 'text-zinc-400 hover:text-white hover:bg-[#222] disabled:opacity-50'}`}
          title="Lista Numerada"
        >
          <ListOrdered size={16} />
        </button>
      </div>
      
      <button
        type="button"
        onClick={toggleRawMode}
        className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold ${isRawMode ? 'bg-accent text-[#0A0A0E]' : 'bg-[#222222] text-zinc-300 hover:bg-[#333]'}`}
        title="Editar código HTML puro"
      >
        <Code size={14} /> {isRawMode ? 'Visual (Tiptap)' : 'HTML Raw'}
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }) {
  const safeValue = value || '';
  const [isRawMode, setIsRawMode] = useState(false);
  const [rawText, setRawText] = useState(safeValue);
  
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
    content: safeValue,
    onUpdate: ({ editor }) => {
      if (!isRawMode) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        className: 'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[300px] p-6 text-zinc-300 [&_p]:my-2 [&_a]:text-accent [&_a]:no-underline hover:[&_a]:underline'
      }
    }
  });

  // Keep editor synced if value changes externally (like clicking a different template)
  useEffect(() => {
    if (safeValue !== rawText) {
      setRawText(safeValue);
    }
    if (editor && safeValue !== editor.getHTML() && !isRawMode) {
      try {
        let from, to;
        if (editor.state && editor.state.selection) {
          from = editor.state.selection.from;
          to = editor.state.selection.to;
        }
        editor.commands.setContent(safeValue, false);
        if (from !== undefined && to !== undefined) {
          editor.commands.setTextSelection({ from, to });
        }
      } catch (e) {
        console.error('Editor sync error:', e);
      }
    }
  }, [safeValue, editor, isRawMode]);

  const handleRawChange = (e) => {
    setRawText(e.target.value);
    onChange(e.target.value);
  };

  const toggleRawMode = () => {
    if (isRawMode) {
      // Switching BACK to Visual Mode -> update Tiptap editor content
      editor.commands.setContent(rawText, false);
    } else {
      // Switching TO HTML Mode -> update rawText from Tiptap editor (or current prop value)
      setRawText(editor.getHTML());
    }
    setIsRawMode(!isRawMode);
  };

  return (
    <div className="border border-[#333333] rounded-lg bg-[#0A0A0E] overflow-hidden flex flex-col focus-within:border-accent/50 transition-colors">
      <MenuBar editor={editor} isRawMode={isRawMode} toggleRawMode={toggleRawMode} />
      <div className="flex-1 overflow-y-auto max-h-[500px]">
        {isRawMode ? (
          <textarea
            value={rawText}
            onChange={handleRawChange}
            className="w-full min-h-[300px] p-6 bg-[#0A0A0E] text-zinc-300 font-mono text-sm focus:outline-none resize-y"
            spellCheck="false"
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
      <div className="bg-[#1a1a1f] px-4 py-2 border-t border-[#222222] text-xs text-zinc-500 flex justify-between">
        <span>Você pode usar variáveis como {'{{userName}}'} e {'{{workshopName}}'} livremente no texto. {isRawMode && <span className="text-yellow-500 font-bold ml-2">Atenção: Ao voltar para o Modo Visual, o editor pode limpar tags HTML avançadas.</span>}</span>
      </div>
    </div>
  );
}
