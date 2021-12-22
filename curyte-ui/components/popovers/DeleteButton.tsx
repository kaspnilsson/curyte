import { IconButton } from '@chakra-ui/button'

interface Props {
  onClick: () => void
  disabled?: boolean
}

const DeleteButton = ({ onClick, disabled }: Props) => {
  return (
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
  )
}

export default DeleteButton
