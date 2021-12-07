import { IconButton } from '@chakra-ui/button'

interface Props {
  onClick: () => void
}

const DeleteButton = ({ onClick }: Props) => {
  return (
    <IconButton aria-label="delete" onClick={onClick} size="xs" variant="ghost">
      <i className="ri-delete-bin-7-line"></i>
    </IconButton>
  )
}

export default DeleteButton
