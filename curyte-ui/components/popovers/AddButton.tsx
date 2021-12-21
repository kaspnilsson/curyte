import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Portal,
} from '@chakra-ui/react'

interface Props {
  onClick: () => void
  disabled?: boolean
  items: React.ReactNode
}

const AddButton = ({ onClick, disabled, items }: Props) => {
  return (
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        aria-label="add"
        onClick={onClick}
        size="sm"
        colorScheme="indigo"
        variant="ghost"
        disabled={disabled}
      >
        <i className="ri-add-circle-line text-slate-900 text-lg"></i>
      </MenuButton>
      <Portal>
        <MenuList className="max-h-96 overflow-auto z-20">{items}</MenuList>
      </Portal>
    </Menu>
  )
}

export default AddButton
