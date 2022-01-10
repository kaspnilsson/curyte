import { MenuButton, Button, Portal, MenuList, Menu } from '@chakra-ui/react'
import { Editor } from '@tiptap/react'
import StyleMenuItems from './menuItems/StyleMenuItems'

interface Props {
  editor: Editor
}

const StyleMenuButton = ({ editor }: Props) => {
  return (
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
  )
}

export default StyleMenuButton
