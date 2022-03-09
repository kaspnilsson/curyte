import TextareaAutosize from 'react-textarea-autosize'
import {
  Button,
  IconButton,
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
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd'
import { editLessonRoute } from '../utils/routes'
import GripIcon from './GripIcon'
import LessonSearchModal from './LessonSearchModal'
import LoadingSpinner from './LoadingSpinner'
import InputDialog, { InputDialogProps } from './InputDialog'
import { Unit } from '../interfaces/unit'
import { Lesson, Profile } from '@prisma/client'
import { createLesson } from '../lib/apiHelpers'

interface Props {
  unit: Unit
  user: Profile
  lessonsByUid: { [uid: string]: Lesson }
  onUpdate: (u: Unit) => Promise<void>
  onDelete: () => Promise<void>
  parentDragHandleProps?: DraggableProvidedDragHandleProps
  unitNumber: number
}

const UnitEditor = ({
  unit,
  user,
  onUpdate,
  onDelete,
  lessonsByUid,
  parentDragHandleProps,
  unitNumber,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(unit.title?.trim() || '')
  const [lessonIds, setLessonIds] = useState(unit.lessonIds || [])
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  const createNewLesson = async (title = '') => {
    setLoading(true)
    const { uid } = await createLesson({
      authorId: user.uid,
      private: true,
      title,
    } as Lesson)
    const newLessonIds = [...lessonIds, uid]
    setLessonIds(newLessonIds)
    await onUpdate({ ...unit, lessonIds: newLessonIds })
    setLoading(false)
    setDialogProps({ ...dialogProps, isOpen: false })
  }

  const onCreateLesson = () => {
    setDialogProps({
      ...dialogProps,
      isOpen: true,
      title: 'Set lesson title',
      description: 'Add a title for your lesson',
      onClose: () => setDialogProps({ ...dialogProps, isOpen: false }),
      onConfirm: createNewLesson,
    })
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
    const newLessonIds = lessonIds.filter((id) => id !== uid)
    setLessonIds(newLessonIds)
    onUpdate({ ...unit, lessonIds: newLessonIds })
  }

  return (
    <>
      <div className="flex w-full gap-2 py-2 border-b-2">
        <span className="flex flex-1 flex-grow gap-2 text-4xl font-semibold leading-tight tracking-tighter">
          <span>{unitNumber}.</span>
          <TextareaAutosize
            value={title}
            onChange={(e) => onTitleUpdate(e.target.value)}
            placeholder="Add a unit title..."
            className="flex-1 flex-grow font-semibold leading-tight tracking-tighter bg-transparent border-0 resize-none text-inherit"
          />
        </span>
        <div className="flex items-center gap-2">
          <Tooltip label="Remove unit">
            <IconButton
              borderRadius="full"
              colorScheme="black"
              size="sm"
              variant="ghost"
              aria-label="Delete lesson"
              icon={<TrashIcon className="w-5 h-5" />}
              onClick={() => onDelete()}
            />
          </Tooltip>
          {parentDragHandleProps && (
            <Tooltip label="Reorder unit">
              <div
                {...parentDragHandleProps}
                className="p-1 rounded-full h-fit hover:bg-zinc-100"
              >
                <GripIcon className="w-5 h-5 text-zinc-900"></GripIcon>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pb-4">
          {loading && <LoadingSpinner />}
          <Droppable droppableId="lessons">
            {(provided: DroppableProvided) => (
              <div
                className="my-4 lessons"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {lessonIds.map((id, index) => (
                  <Draggable key={id + index} draggableId={id} index={index}>
                    {(provided, snapshot) => (
                      <span
                        className={classNames(
                          'flex items-center w-full gap-2 px-4 py-2 rounded',
                          {
                            'hover:bg-zinc-100': lessonsByUid[id],
                            'bg-zinc-50 shadow-xl':
                              lessonsByUid[id] && snapshot.isDragging,
                            'bg-red-200': !lessonsByUid[id],
                          }
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <GripIcon className="w-6 h-6 p-1 text-zinc-500"></GripIcon>
                        <span className="flex flex-1 gap-2 font-semibold leading-tight tracking-tighter">
                          {lessonsByUid[id] && (
                            <>
                              <div>{index + 1}.</div>
                              {lessonsByUid[id].title || '(no title)'}
                            </>
                          )}
                          {!lessonsByUid[id] && (
                            <span className="text-red-700">
                              Lesson not found
                            </span>
                          )}
                        </span>
                        <Tooltip label="Edit lesson">
                          <IconButton
                            size="sm"
                            rounded="full"
                            className="self-end "
                            colorScheme="black"
                            variant="ghost"
                            aria-label="Edit lesson"
                            icon={<PencilAltIcon className="w-5 h-5" />}
                            onClick={() => onEditLesson(id)}
                          />
                        </Tooltip>
                        <Tooltip label="Remove lesson">
                          <IconButton
                            size="sm"
                            rounded="full"
                            className="self-end "
                            colorScheme="black"
                            variant="ghost"
                            aria-label="Delete lesson"
                            icon={<TrashIcon className="w-5 h-5" />}
                            onClick={() => onDeleteLesson(id)}
                          />
                        </Tooltip>
                      </span>
                    )}
                  </Draggable>
                ))}
                {!lessonIds?.length && 'No lessons in this unit'}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="flex gap-2 pb-4">
            <Button
              className="flex items-center gap-1 w-fit"
              colorScheme="black"
              onClick={onCreateLesson}
            >
              <PlusIcon className="w-4 h-4" />
              Create new lesson
            </Button>
            <Button
              className="flex items-center gap-1 w-fit"
              colorScheme="black"
              onClick={onOpen}
            >
              <SearchIcon className="w-4 h-4" />
              Add existing lesson
            </Button>
          </div>
        </div>
      </DragDropContext>
      <LessonSearchModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectLesson={onSelectExistingLesson}
      />
      <InputDialog {...dialogProps} />
    </>
  )
}

export default UnitEditor
