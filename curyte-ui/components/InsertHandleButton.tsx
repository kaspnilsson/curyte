import { Editor } from '@tiptap/core'
import { Menu, MenuList, MenuButton, Portal, Tooltip } from '@chakra-ui/react'
import React, { ReactNode, useState } from 'react'
import InsertMenuItems from './menuItems/InsertMenuItems'
import InputDialog, { InputDialogProps } from './InputDialog'

interface Props {
  editor: Editor | null
  buttonContent: ReactNode
  className?: string
  forceInsertAtEnd?: boolean
  onOpenStateChange?: (isOpen: boolean) => void
}

const InsertHandleButton = ({
  editor,
  buttonContent,
  className = '',
  forceInsertAtEnd = false,
  onOpenStateChange,
}: Props) => {
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
      <InputDialog {...dialogProps} />
      <Menu
        id="insert-menu"
        isLazy
        boundary="scrollParent"
        colorScheme="zinc"
        onOpen={onOpenStateChange ? () => onOpenStateChange(true) : () => null}
        onClose={
          onOpenStateChange ? () => onOpenStateChange(false) : () => null
        }
      >
        <Tooltip label="Insert rich content like videos and docs at the end of the lesson">
          <MenuButton className={className}>{buttonContent}</MenuButton>
        </Tooltip>
        <Portal>
          <MenuList className="z-20 overflow-auto max-h-96">
            <InsertMenuItems
              editor={editor}
              openDialog={openDialog}
              forceInsertAtEnd={forceInsertAtEnd}
            />
          </MenuList>
        </Portal>
      </Menu>
    </div>
  )
}
export default InsertHandleButton
