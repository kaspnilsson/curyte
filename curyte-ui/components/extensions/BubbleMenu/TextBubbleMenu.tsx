import React from 'react'
import { BubbleMenu, Editor } from '@tiptap/react'
import MenuIconButton from '../../MenuIconButton'
import 'tippy.js/dist/svg-arrow.css'
import { Center, Divider } from '@chakra-ui/react'
import StyleMenuButton from '../../StyleMenuButton'

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
        duration: 200,
        animation: 'shift-away',
        zIndex: 1000,
      }}
      shouldShow={({ editor, state }) =>
        editor.isActive('paragraph') && !state.selection.empty
      }
      className="relative flex items-center gap-1 p-1 overflow-hidden bg-white rounded shadow"
    >
      <MenuIconButton
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<i className="text-lg ri-bold" />}
      />
      <MenuIconButton
        label="Italicize"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<i className="text-lg ri-italic" />}
      />
      <MenuIconButton
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<i className="text-lg ri-underline" />}
      />
      <MenuIconButton
        label="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        icon={<i className="text-lg ri-mark-pen-line" />}
      />
      <MenuIconButton
        label="Code (inline)"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={<i className="text-lg ri-code-line" />}
      />
      <MenuIconButton
        label="Clear formatting"
        onClick={() => {
          editor.chain().focus().unsetAllMarks().run()
          editor.chain().focus().clearNodes().run()
        }}
        icon={<i className="text-lg ri-format-clear" />}
      />
      <Center className="w-2 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-200"
        />
      </Center>
      <StyleMenuButton editor={editor} />
    </BubbleMenu>
  )
}

export default TextBubbleMenu
