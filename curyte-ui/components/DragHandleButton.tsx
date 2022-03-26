import { TrashIcon } from '@heroicons/react/outline'
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Tooltip,
} from '@chakra-ui/react'
import { Editor } from '@tiptap/core'
import GripIcon from './GripIcon'
import MenuItem from './MenuItem'

interface Props {
  editor: Editor
}

const DragHandleButton = ({ editor }: Props) => {
  return (
    <Menu isLazy>
      <Tooltip
        placement="bottom-start"
        label={
          <div className="z-20 block grid-rows-2 p-4 text-sm text-center bg-white rounded shadow text-zinc-500">
            <div>
              <span className="text-zinc-900">Drag</span> to move
            </div>
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
          className="rounded hover:bg-zinc-100 cursor-grab !p-2"
        >
          <GripIcon className="w-3 h-4 text-zinc-500"></GripIcon>
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
