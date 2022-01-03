import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from '@chakra-ui/react'

interface Props {
  disabled?: boolean
  items: React.ReactNode
}

const AddButton = ({ disabled, items }: Props) => {
  return (
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        aria-label="add"
        size="sm"
        colorScheme="zinc"
        variant="ghost"
        disabled={disabled}
      >
        <i className="text-lg ri-add-circle-line text-zinc-900"></i>
      </MenuButton>
      <Portal>
        <MenuList className="z-20 overflow-auto max-h-96">{items}</MenuList>
      </Portal>
    </Menu>
  )
}

export default AddButton
