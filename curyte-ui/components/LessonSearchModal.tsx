import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { SearchIcon } from '@heroicons/react/outline'
import { Lesson } from '@prisma/client'
import { useMemo, useState } from 'react'
import { debounce } from 'ts-debounce'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import { queryLessons } from '../lib/apiHelpers'
import LessonList from './LessonList'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  onClose: () => void
  isOpen: boolean
  onSelectLesson?: (l: Lesson) => void
}

const LessonSearchModal = ({ onClose, isOpen, onSelectLesson }: Props) => {
  const [query, setQuery] = useState('')
  const [lessons, setLessons] = useState<LessonWithProfile[]>([])
  const [loading, setLoading] = useState(false)

  const debouncedDoSearch = useMemo(
    () =>
      debounce(async (q: string) => {
        setLoading(true)
        setLessons(await queryLessons(q))
        setLoading(false)
      }, 100),
    []
  )

  const handleQueryChange = (q: string) => {
    setQuery(q)
    if (!q) return
    debouncedDoSearch(q)
  }

  const handleModalClose = () => {
    setQuery('')
    setLessons([])
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="800px" maxH="80vh" className="overflow-auto">
        <ModalBody>
          <InputGroup className="m-4 !w-auto">
            <InputLeftElement>
              <SearchIcon className="w-5 h-5 text-zinc-500" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              variant="filled"
              colorScheme="black"
              value={query}
              onChange={(e) => handleQueryChange(e.currentTarget.value)}
            ></Input>
          </InputGroup>
          {query && (
            <div className="relative flex flex-wrap items-center justify-center w-full min-h-full gap-4 pt-4 mt-6 border-t-2 border-zinc-200">
              {loading && <LoadingSpinner />}
              {!!lessons && (
                <LessonList lessons={lessons} onSelectLesson={onSelectLesson} />
              )}
              {!lessons?.length && 'None found!'}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LessonSearchModal
