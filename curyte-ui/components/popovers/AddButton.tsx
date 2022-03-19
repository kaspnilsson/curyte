import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  Tooltip,
} from '@chakra-ui/react'

interface Props {
  disabled?: boolean
  items: React.ReactNode
}

const AddButton = ({ disabled, items }: Props) => {
  return (
    <Menu isLazy>
      <Tooltip label="Insert content">
        <MenuButton
          as={IconButton}
          aria-label="add"
          size="sm"
          colorScheme="zinc"
          variant="ghost"
          disabled={disabled}
        >
          <i className="text-lg font-thin ri-add-circle-line text-zinc-900"></i>
        </MenuButton>
      </Tooltip>
      <Portal>
        <MenuList className="z-20 overflow-auto max-h-96">{items}</MenuList>
      </Portal>
    </Menu>
  )
}

export default AddButton
