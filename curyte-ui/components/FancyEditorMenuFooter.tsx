import { Editor } from '@tiptap/react'
import {
  Menu,
  MenuList,
  MenuButton,
  Button,
  Portal,
  Tooltip,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import InsertMenuItems from './menuItems/InsertMenuItems'
import { InputDialogProps } from './InputDialog'

interface Props {
  editor: Editor | null
}

const FancyEditorMenuFooter = ({ editor }: Props) => {
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
    <div className="flex flex-wrap items-center justify-center w-full gap-1 py-1 mb-4 ">
      <Menu id="insert-menu" isLazy boundary="scrollParent" colorScheme="zinc">
        <Tooltip label="Insert rich content like videos and docs at the end of the lesson">
          <MenuButton size="lg" as={Button}>
            <div className="flex items-center gap-1 text-base text-zinc-900">
              Add content
              <i className="w-2 text-xl ri-add-line"></i>
            </div>
          </MenuButton>
        </Tooltip>
        <Portal>
          <MenuList className="z-20 overflow-auto max-h-96">
            <InsertMenuItems
              editor={editor}
              openDialog={openDialog}
              forceInsertAtEnd
            />
          </MenuList>
        </Portal>
      </Menu>
    </div>
  )
}
export default FancyEditorMenuFooter
