import React from 'react'
import { BubbleMenu, Editor } from '@tiptap/react'
import MenuIconButton from '../../MenuIconButton'
import 'tippy.js/dist/svg-arrow.css'

interface Props {
  editor: Editor
}

const TextBubbleMenu = ({ editor }: Props) => {
  if (!editor) {
    return null
  }
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        appendTo: () => document.body,
        duration: 200,
        animation: 'shift-away',
        zIndex: 1000,
      }}
      shouldShow={({ editor, state }) =>
        editor.isActive('paragraph') && !state.selection.empty
      }
      className="relative flex overflow-hidden rounded shadow bg-white p-1 gap-1"
    >
      <MenuIconButton
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<i className="text-gray-900 ri-lg ri-bold" />}
      />
      <MenuIconButton
        label="Italicize"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<i className="text-gray-900 ri-lg ri-italic" />}
      />
      <MenuIconButton
        label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<i className="text-gray-900 ri-lg ri-strikethrough" />}
      />
      <MenuIconButton
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<i className="text-gray-900 ri-lg ri-underline" />}
      />
      <MenuIconButton
        label="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        icon={<i className="text-gray-900 ri-lg ri-mark-pen-line" />}
      />
      <MenuIconButton
        label="Superscript"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive('superscript')}
        icon={<i className="text-gray-900 ri-lg ri-superscript" />}
      />
      <MenuIconButton
        label="Code (inline)"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={<i className="text-gray-900 ri-lg ri-code-line" />}
      />
      <MenuIconButton
        label="Clear formatting"
        onClick={() => {
          editor.chain().focus().unsetAllMarks().run()
          editor.chain().focus().clearNodes().run()
        }}
        icon={<i className="text-gray-900 ri-lg ri-format-clear" />}
      />
    </BubbleMenu>
  )
}

export default TextBubbleMenu
