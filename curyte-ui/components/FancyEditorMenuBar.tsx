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
    <div className="flex flex-wrap border-b border-t border-gray-200 mb-4 py-1 items-center gap-1 bg-white z-10 sticky top-0">
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
      <Center className="h-6 w-2">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <Menu id="style-menu" isLazy boundary="scrollParent" colorScheme="purple">
        <MenuButton size="sm" variant="ghost" colorScheme="purple" as={Button}>
          <div className="flex items-center text-gray-900 gap-1 text-sm">
            Style
            <i className="ri-arrow-drop-down-line text-lg w-2"></i>
          </div>
        </MenuButton>
        <Portal>
          <MenuList className="max-h-96 overflow-auto z-20">
            <StyleMenuItems editor={editor} />
          </MenuList>
        </Portal>
      </Menu>
      <Center className="h-6 w-2">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
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
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
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
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <MenuIconButton
        label="Add a line"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<i className="text-lg ri-separator" />}
      />
      <Menu
        id="insert-menu"
        isLazy
        boundary="scrollParent"
        colorScheme="purple"
      >
        <MenuButton size="sm" variant="ghost" colorScheme="purple" as={Button}>
          <div className="flex items-center text-gray-900 gap-1 text-sm">
            Insert
            <i className="ri-arrow-drop-down-line text-lg w-2"></i>
          </div>
        </MenuButton>
        <Portal>
          <MenuList className="max-h-96 overflow-auto z-20">
            <InsertMenuItems editor={editor} openDialog={openDialog} />
          </MenuList>
        </Portal>
      </Menu>
    </div>
  )
}
export default FancyEditorMenuBar
