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
  forceNewBlock?: boolean
}

const InsertHandleButton = ({
  editor,
  buttonContent,
  className = '',
  forceInsertAtEnd = false,
  forceNewBlock = false,
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
    <div className="flex flex-wrap items-center justify-center w-full gap-1">
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
        <Tooltip
          label={
            <div className="text-center text-zinc-400">
              <div>
                <span className="text-zinc-50">Click</span> to insert content
                below
              </div>
            </div>
          }
          closeDelay={10}
        >
          <MenuButton className={className}>{buttonContent}</MenuButton>
        </Tooltip>
        <Portal>
          <MenuList className="z-20 overflow-auto max-h-96">
            <InsertMenuItems
              editor={editor}
              openDialog={openDialog}
              forceInsertAtEnd={forceInsertAtEnd}
              forceNewBlock={forceNewBlock}
            />
          </MenuList>
        </Portal>
      </Menu>
    </div>
  )
}
export default InsertHandleButton
