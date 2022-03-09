import { IconButton } from '@chakra-ui/button'
import { Tooltip } from '@chakra-ui/react'

interface Props {
  onClick: () => void
  disabled?: boolean
}

const DeleteButton = ({ onClick, disabled }: Props) => {
  return (
    <Tooltip label="Delete content block">
      <IconButton
        aria-label="delete"
        onClick={onClick}
        size="sm"
        colorScheme="zinc"
        variant="ghost"
        disabled={disabled}
      >
        <i className="text-lg ri-delete-bin-7-line text-zinc-900"></i>
      </IconButton>
    </Tooltip>
  )
}

export default DeleteButton
