"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyleKit } from "@tiptap/extension-text-style";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyleKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content: value,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  // Inserir link
  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Digite a URL:", previousUrl || "");

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  // Inserir imagem
  const addImage = () => {
    const url = window.prompt("Digite a URL da imagem:");

    if (!url) {
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({ src: url })
      .run();
  };

  // Inserir vídeo
  const addVideo = () => {
    const url = window.prompt("Digite a URL do vídeo:");

    if (!url) {
      return;
    }

    editor
      .chain()
      .focus()
      .insertContent(
        `<p><a href="${url}" target="_blank">${url}</a></p>`
      )
      .run();
  };

  return (
    <div className="w-full border border-neutral-300 bg-white">
      {/* TOOLBAR */}
      <div className="flex items-center gap-1 border-b border-neutral-300 px-2 py-1.5">
        
        {/* Estilo */}
        <select
          className="h-8 min-w-22.5 border-none bg-transparent px-2 text-sm outline-none"
          defaultValue="normal"
          onChange={(e) => {
            const value = e.target.value;

            if (value === "normal") {
              editor
                .chain()
                .focus()
                .setParagraph()
                .run();
            }

            if (value === "heading1") {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 1 })
                .run();
            }

            if (value === "heading2") {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run();
            }

            if (value === "heading3") {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 3 })
                .run();
            }
          }}
        >
          <option value="normal">Normal</option>
          <option value="heading1">Título 1</option>
          <option value="heading2">Título 2</option>
          <option value="heading3">Título 3</option>
        </select>

        <ToolbarDivider />

        {/* Negrito */}
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrito"
        >
          <strong>B</strong>
        </ToolbarButton>

        {/* Itálico */}
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Itálico"
        >
          <em>I</em>
        </ToolbarButton>

        {/* Sublinhado */}
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Sublinhado"
        >
          <u>U</u>
        </ToolbarButton>

        {/* Tachado */}
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Tachado"
        >
          <s>S</s>
        </ToolbarButton>

        {/* Citação */}
        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          title="Citação"
        >
          ❝
        </ToolbarButton>

        {/* Lista não ordenada */}
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          title="Lista"
        >
          ☷
        </ToolbarButton>

        {/* Lista ordenada */}
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          title="Lista numerada"
        >
          ☷
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={addLink}
          title="Inserir link"
        >
          🔗
        </ToolbarButton>

        {/* Imagem */}
        <ToolbarButton
          onClick={addImage}
          title="Inserir imagem"
        >
          🖼
        </ToolbarButton>

        {/* Vídeo */}
        <ToolbarButton
          onClick={addVideo}
          title="Inserir vídeo"
        >
          ▣
        </ToolbarButton>

        {/* Limpar formatação */}
        <ToolbarButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .clearNodes()
              .unsetAllMarks()
              .run()
          }
          title="Limpar formatação"
        >
          Tₓ
        </ToolbarButton>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="
          min-h-50
          px-4
          py-3
          text-sm
          text-left
          focus-within:outline-none
        "
      />
    </div>
  );
}

/* -------------------------------- */
/* COMPONENTES DA TOOLBAR */
/* -------------------------------- */

function ToolbarButton({
  children,
  onClick,
  active = false,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`
        flex
        h-8
        min-w-8
        items-center
        justify-center
        rounded
        px-2
        text-sm
        transition
        ${
          active
            ? "bg-neutral-200"
            : "hover:bg-neutral-100"
        }
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <div className="mx-1 h-5 w-px bg-neutral-200" />
  );
}