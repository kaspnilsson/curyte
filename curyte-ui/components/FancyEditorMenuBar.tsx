import { Editor } from '@tiptap/react'
import {
  Center,
  Divider,
  Menu,
  MenuList,
  MenuButton,
  Button,
  Portal,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import MenuIconButton from './MenuIconButton'
import StyleMenuItems from './menuItems/StyleMenuItems'
import InsertMenuItems from './menuItems/InsertMenuItems'
import InputDialog, { InputDialogProps } from './InputDialog'

interface Props {
  editor: Editor | null
}

const FancyEditorMenuBar = ({ editor }: Props) => {
  const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  const onClose = () => {
    setDialogProps({ ...dialogProps, isOpen: false })
  }

  const openDialog = (input: Partial<InputDialogProps>) => {
    setDialogProps({ ...dialogProps, ...input, onClose })
  }

  if (!editor) {
    return null
  }
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 py-1 mb-4 bg-white border-t border-b border-zinc-300">
      <InputDialog {...dialogProps} />
      <MenuIconButton
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        icon={<i className="text-lg ri-arrow-go-back-line" />}
      />
      <MenuIconButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        icon={<i className="text-lg ri-arrow-go-forward-line" />}
      />
      <Center className="w-2 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-300"
        />
      </Center>
      <Menu id="style-menu" isLazy boundary="scrollParent" colorScheme="zinc">
        <MenuButton size="sm" variant="ghost" colorScheme="zinc" as={Button}>
          <div className="flex items-center gap-1 text-sm text-zinc-900">
            Style
            <i className="w-2 text-lg ri-arrow-drop-down-line"></i>
          </div>
        </MenuButton>
        <Portal>
          <MenuList className="z-20 overflow-auto max-h-96">
            <StyleMenuItems editor={editor} />
          </MenuList>
        </Portal>
      </Menu>
      <Center className="w-2 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-300"
        />
      </Center>
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
        label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<i className="text-lg ri-strikethrough" />}
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
        label="Superscript"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive('superscript')}
        icon={<i className="text-lg ri-superscript" />}
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
      <Center className="w-4 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-300"
        />
      </Center>
      <MenuIconButton
        label="Bulleted list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<i className="text-lg ri-list-unordered" />}
      />

      <MenuIconButton
        label="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<i className="text-lg ri-list-ordered" />}
      />
      <MenuIconButton
        label="To-do list"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        icon={<i className="text-lg ri-list-check-2" />}
      />
      <MenuIconButton
        label="Block quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={<i className="text-lg ri-double-quotes-l" />}
      />
      <Center className="w-4 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-300"
        />
      </Center>
      <MenuIconButton
        label="Add a line"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<i className="text-lg ri-separator" />}
      />
      <Menu id="insert-menu" isLazy boundary="scrollParent" colorScheme="zinc">
        <MenuButton size="sm" variant="ghost" colorScheme="zinc" as={Button}>
          <div className="flex items-center gap-1 text-sm text-zinc-900">
            Insert
            <i className="w-2 text-lg ri-arrow-drop-down-line"></i>
          </div>
        </MenuButton>
        <Portal>
          <MenuList className="z-20 overflow-auto max-h-96">
            <InsertMenuItems editor={editor} openDialog={openDialog} />
          </MenuList>
        </Portal>
      </Menu>
    </div>
  )
}
export default FancyEditorMenuBar
