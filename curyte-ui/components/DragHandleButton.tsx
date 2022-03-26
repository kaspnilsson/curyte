import { TrashIcon, DotsVerticalIcon } from '@heroicons/react/outline'
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Tooltip,
} from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import MenuItem from './MenuItem'
import classNames from 'classnames'

interface Props {
  editor: Editor
  draggable: boolean
  onOpenStateChange?: (isOpen: boolean) => void
}

const DragHandleButton = ({ editor, draggable, onOpenStateChange }: Props) => {
  return (
    <Menu
      isLazy
      onOpen={onOpenStateChange ? () => onOpenStateChange(true) : () => null}
      onClose={onOpenStateChange ? () => onOpenStateChange(false) : () => null}
    >
      <Tooltip
        placement="bottom-start"
        label={
          <div className="z-20 block grid-rows-2 p-4 text-sm text-center bg-white rounded shadow text-zinc-500">
            {draggable && (
              <div>
                <span className="text-zinc-900">Drag</span> to move
              </div>
            )}
            <div>
              <span className="text-zinc-900">Click</span> to open menu
            </div>
          </div>
        }
      >
        <MenuButton
          as={IconButton}
          aria-label="add"
          colorScheme="zinc"
          variant="ghost"
          //   disabled={disabled}
          className={classNames('rounded hover:bg-zinc-100 !p-1', {
            'cursor-grab': draggable,
          })}
        >
          <DotsVerticalIcon className="w-5 h-5 text-zinc-500"></DotsVerticalIcon>
        </MenuButton>
      </Tooltip>
      <Portal>
        <MenuList className="z-20 p-4 overflow-auto bg-white rounded shadow max-h-96">
          <MenuItem
            disabled={editor.isEmpty}
            onClick={() => {
              editor.commands.selectParentNode()
              editor.commands.deleteSelection()
            }}
            label="Delete"
            description="Delete the current block"
            icon={<TrashIcon className="w-8 h-8" />}
          />
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default DragHandleButton
