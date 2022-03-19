import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
} from '@chakra-ui/react'
import { SearchIcon } from '@heroicons/react/outline'
import { Lesson } from '@prisma/client'
import { useMemo, useState } from 'react'
import { debounce } from 'ts-debounce'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import { queryLessons } from '../lib/apiHelpers'
import LessonList from './LessonList'

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
      }, 250),
    []
  )

  const handleQueryChange = (q: string) => {
    setQuery(q)
    if (!q) return
    setLoading(true)
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
            <div className="flex flex-wrap items-center justify-center w-full min-h-full gap-4 pt-4 mt-6 border-t-2 border-zinc-200">
              {loading && <Spinner size="xl" className="m-16" />}
              {!loading && !!lessons && (
                <LessonList lessons={lessons} onSelectLesson={onSelectLesson} />
              )}
              {!loading && !lessons?.length && 'None found!'}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LessonSearchModal
