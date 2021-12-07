import { IconButton } from '@chakra-ui/button'

interface Props {
  onClick: () => void
}

const AddButton = ({ onClick }: Props) => {
  return (
    <IconButton aria-label="add" onClick={onClick} size="xs" variant="ghost">
      <i className="ri-add-line"></i>
    </IconButton>
  )
}

export default AddButton
