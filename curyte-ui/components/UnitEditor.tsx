import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Heading,
  IconButton,
  Input,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  PlusIcon,
  SearchIcon,
  PencilAltIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { createLesson } from '../firebase/api'
import { Author } from '../interfaces/author'
import { Lesson } from '../interfaces/lesson'
import { Unit } from '../interfaces/path'
import { editLessonRoute } from '../utils/routes'
import GripIcon from './GripIcon'
import LessonSearchModal from './LessonSearchModal'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  unit: Unit
  user: Author
  lessonsByUid: { [uid: string]: Lesson }
  onUpdate: (u: Unit) => Promise<void>
}

const UnitEditor = ({ unit, user, onUpdate, lessonsByUid }: Props) => {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(unit.title?.trim() || '')
  const [lessonIds, setLessonIds] = useState(unit.lessonIds || [])
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const createNewLesson = async () => {
    setLoading(true)
    const uid = await createLesson({ authorId: user.uid } as Lesson)
    const newLessonIds = [...lessonIds, uid]
    setLessonIds(newLessonIds)
    await onUpdate({ ...unit, lessonIds: newLessonIds })
    setLoading(false)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newLessonIds = [...lessonIds]
    const [reorderedItem] = newLessonIds.splice(result.source.index, 1)
    newLessonIds.splice(result.destination.index, 0, reorderedItem)
    setLessonIds(newLessonIds)
    onUpdate({ ...unit, lessonIds: newLessonIds })
  }

  const onTitleUpdate = (value: string) => {
    setTitle(value)
    onUpdate({ ...unit, title: value })
  }

  const onEditLesson = (uid: string) => {
    router.push(editLessonRoute(uid))
  }

  const onSelectExistingLesson = (l: Lesson) => {
    const newLessonIds = [...lessonIds, l.uid]
    setLessonIds(newLessonIds)
    onClose()
    onUpdate({ ...unit, lessonIds: newLessonIds })
    toast({
      title: 'Lesson added!',
    })
  }

  const onDeleteLesson = (uid: string) => {
    setLessonIds(lessonIds.filter((id) => id !== uid))
  }

  return (
    <>
      <AccordionItem>
        <AccordionButton>
          <div className="flex items-center w-full gap-2">
            <GripIcon className="w-8 h-8 p-1 text-zinc-500"></GripIcon>
            <Input
              type="text"
              size="lg"
              value={title}
              onChange={(e) => onTitleUpdate(e.target.value)}
              colorScheme="zinc"
              placeholder="Unit title..."
              className="flex-1 flex-grow font-semibold tracking-tight resize-none leading-tighter"
            ></Input>
            <AccordionIcon />
          </div>
        </AccordionButton>
        <AccordionPanel>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="relative">
              <Heading
                className="font-bold leading-tight tracking-tight"
                fontSize="xl"
              >
                Lessons
              </Heading>
              {loading && <LoadingSpinner />}
              <Droppable droppableId="lessons">
                {(provided: DroppableProvided) => (
                  <Accordion
                    allowMultiple
                    allowToggle
                    className="my-4 lessons"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {lessonIds.map((id, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided, snapshot) => (
                          <span
                            className={classNames(
                              'flex items-center w-full gap-2 px-4 py-2 rounded hover:bg-zinc-100',
                              { 'bg-zinc-50 shadow-xl': snapshot.isDragging }
                            )}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <GripIcon className="w-6 h-6 p-1 text-zinc-500"></GripIcon>
                            <span className="flex flex-1 gap-2 font-semibold leading-tight tracking-tight">
                              <div>{index + 1}.</div>
                              {lessonsByUid[id]
                                ? lessonsByUid[id].title || '(no title)'
                                : id}
                            </span>
                            <Tooltip label="Edit lesson">
                              <IconButton
                                colorScheme="black"
                                size="sm"
                                rounded="full"
                                className="self-end"
                                aria-label="Edit lesson"
                                icon={<PencilAltIcon className="w-4 h-4" />}
                                onClick={() => onEditLesson(id)}
                              />
                            </Tooltip>
                            <Tooltip label="Remove">
                              <IconButton
                                colorScheme="black"
                                size="sm"
                                rounded="full"
                                className="self-end"
                                aria-label="Delete lesson"
                                icon={<TrashIcon className="w-4 h-4" />}
                                onClick={() => onDeleteLesson(id)}
                              />
                            </Tooltip>
                          </span>
                        )}
                      </Draggable>
                    ))}
                    {!lessonIds?.length && 'No lessons in this unit'}
                    {provided.placeholder}
                  </Accordion>
                )}
              </Droppable>
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-1 w-fit-content"
                  colorScheme="black"
                  onClick={() => createNewLesson()}
                >
                  <PlusIcon className="w-4 h-4" />
                  Create new lesson
                </Button>
                <Button
                  className="flex items-center gap-1 w-fit-content"
                  colorScheme="black"
                  onClick={onOpen}
                >
                  <SearchIcon className="w-4 h-4" />
                  Add existing lesson
                </Button>
              </div>
            </div>
          </DragDropContext>
        </AccordionPanel>
      </AccordionItem>
      <LessonSearchModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectLesson={onSelectExistingLesson}
      />
    </>
  )
}

export default UnitEditor
