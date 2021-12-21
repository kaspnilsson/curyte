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
      colorScheme="purple"
      variant="ghost"
      disabled={disabled}
    >
      <i className="ri-delete-bin-7-line text-slate-900 text-lg"></i>
    </IconButton>
  )
}

export default DeleteButton
