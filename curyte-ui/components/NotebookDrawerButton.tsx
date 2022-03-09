import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { PencilIcon } from '@heroicons/react/outline'
import NotesEditor from './NotesEditor'

interface Props {
  lessonId: string
  style?: 'small' | 'large'
}

const NotebookDrawerButton = ({ lessonId, style = 'large' }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme="black"
        variant={style === 'large' ? 'solid' : 'ghost'}
        onClick={onOpen}
        className="flex items-center gap-2"
      >
        <PencilIcon className="w-5 h-5" />
        {style === 'large' && 'Notebook'}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        finalFocusRef={btnRef}
        autoFocus
      >
        <DrawerOverlay />
        <DrawerContent className="h-[80vh] px-4 py-2 overflow-auto">
          <DrawerCloseButton />
          <NotesEditor lessonId={lessonId} />
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default NotebookDrawerButton
