import { TrashIcon, DotsVerticalIcon } from '@heroicons/react/outline'
import { Menu, MenuButton, MenuList, Portal, Tooltip } from '@chakra-ui/react'
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
          <div className="text-center text-zinc-400">
            {draggable && (
              <div>
                <span className="text-zinc-50">Drag</span> to move
              </div>
            )}
            <div>
              <span className="text-zinc-50">Click</span> to open menu
            </div>
          </div>
        }
      >
        <MenuButton
          aria-label="add"
          variant="ghost"
          className={classNames(
            'rounded p-1 hover:bg-zinc-100 flex items-center justify-center',
            {
              'cursor-grab': draggable,
            }
          )}
        >
          <DotsVerticalIcon className="w-5 h-5 text-zinc-500" />
        </MenuButton>
      </Tooltip>
      <Portal>
        <MenuList className="z-20 max-h-96">
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
