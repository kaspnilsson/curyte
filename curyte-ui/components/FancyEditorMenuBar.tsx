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
import InsertMenuItems from './menuItems/InsertMenuItems'
import InputDialog, { InputDialogProps } from './InputDialog'
import StyleMenuButton from './StyleMenuButton'

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
    <div className="sticky z-10 flex flex-wrap items-center justify-center w-full gap-1 py-1 mb-4 bg-white border-t border-b top-16 border-zinc-200">
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
          className="opacity-100 border-zinc-200"
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
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<i className="text-lg ri-underline" />}
      />
      <Center className="w-2 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-200"
        />
      </Center>
      <StyleMenuButton editor={editor} />
      <Center className="w-4 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-200"
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
        label="Block quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={<i className="text-lg ri-double-quotes-l" />}
      />
      <Center className="w-4 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-200"
        />
      </Center>
      {/* <MenuIconButton
        label="Add a line"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<i className="text-lg ri-separator" />}
      /> */}
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
