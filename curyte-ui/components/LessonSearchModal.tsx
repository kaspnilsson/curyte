import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react'
import { Lesson } from '@prisma/client'
import Search from './Search'

interface Props {
  onClose: () => void
  isOpen: boolean
  onSelectLesson?: (l: Lesson) => void
}

const LessonSearchModal = ({ onClose, isOpen, onSelectLesson }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent maxW="800px" maxH="80vh" className="overflow-auto">
      <ModalBody>
        <Search onSelect={onSelectLesson} />
      </ModalBody>
    </ModalContent>
  </Modal>
)

export default LessonSearchModal
