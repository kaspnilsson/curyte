import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  IconButton,
  Input,
} from '@chakra-ui/react'
import {
  PlusIcon,
  SearchIcon,
  PencilAltIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { createDraft } from '../firebase/api'
import { Author } from '../interfaces/author'
import { Lesson } from '../interfaces/lesson'
import { Unit } from '../interfaces/path'
import GripIcon from './GripIcon'
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

  const createNewLesson = async () => {
    setLoading(true)
    const uid = await createDraft({ authorId: user.uid } as Lesson)
    const newLessonIds = [...lessonIds, uid]
    setLessonIds(newLessonIds)
    await onUpdate({ ...unit, lessonIds: newLessonIds })
    setLoading(true)
  }

  const addExistingLesson = async () => {
    // const uid = await createDraft({ authorId: user.uid } as Lesson)
    // const newLessonIds = [...lessonIds, uid]
    // setLessonIds(newLessonIds)
    // onUpdate({ ...unit, lessonIds: newLessonIds })
    console.error('todo')
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    console.error('todo')
  }

  const onTitleUpdate = (value: string) => {
    setTitle(value)
    onUpdate({ ...unit, title: value })
  }

  const onEditLesson = (uid: string) => {
    console.error('todo')
  }

  const onDeleteLesson = (uid: string) => {
    setLessonIds(lessonIds.filter((id) => id !== uid))
  }

  return (
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
            className="flex-1"
          ></Input>
          <AccordionIcon />
        </div>
      </AccordionButton>
      <AccordionPanel>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="relative">
            {loading && <LoadingSpinner />}
            <Droppable droppableId="lessons">
              {(provided: DroppableProvided) => (
                <Accordion
                  allowMultiple
                  allowToggle
                  className="my-8 lessons"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {lessonIds.map((id, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <span
                          className="flex items-center w-full gap-2 hover:bg-zinc-50"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <GripIcon className="w-6 h-6 p-1 text-zinc-500"></GripIcon>
                          <span className="flex-1">
                            {lessonsByUid[id]
                              ? lessonsByUid[id].title || '(no title)'
                              : id}
                          </span>
                          <IconButton
                            colorScheme="black"
                            variant="ghost"
                            size="sm"
                            className="self-end"
                            aria-label="Edit lesson"
                            icon={<PencilAltIcon className="w-4 h-4" />}
                            onClick={() => onEditLesson(id)}
                          />
                          <IconButton
                            colorScheme="black"
                            variant="ghost"
                            size="sm"
                            className="self-end"
                            aria-label="Delete lesson"
                            icon={<TrashIcon className="w-4 h-4" />}
                            onClick={() => onDeleteLesson(id)}
                          />
                        </span>
                      )}
                    </Draggable>
                  ))}
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
                onClick={() => addExistingLesson()}
              >
                <SearchIcon className="w-4 h-4" />
                Add existing lesson
              </Button>
            </div>
          </div>
        </DragDropContext>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default UnitEditor
