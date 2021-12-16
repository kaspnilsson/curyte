import { IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react'

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
        colorScheme="purple"
        variant="ghost"
        disabled={disabled}
      >
        <i className="ri-add-circle-line text-gray-900 text-lg"></i>
      </MenuButton>
      <MenuList className="max-h-96 overflow-auto z-20">{items}</MenuList>
    </Menu>
  )
}

export default AddButton
