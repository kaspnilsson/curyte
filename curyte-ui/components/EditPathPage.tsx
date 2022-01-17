import { UploadIcon, LockClosedIcon } from '@heroicons/react/solid'
import { CheckIcon, PlusIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import { Author } from '../interfaces/author'
import { Path, Unit } from '../interfaces/path'
import Layout from './Layout'
import { computeClassesForTitle } from './LessonTitle'
import TextareaAutosize from 'react-textarea-autosize'
import { useEffect, useState } from 'react'
import { Button, Portal, Spinner, Text, useToast } from '@chakra-ui/react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd'
import UnitEditor from './UnitEditor'
import { Lesson } from '../interfaces/lesson'
import { getLesson } from '../firebase/api'
import classNames from 'classnames'
import { uuid } from '../utils/uuid'
import Container from './Container'
import { useRouter } from 'next/router'
import { pathRoute } from '../utils/routes'
import { Confetti } from './Confetti'

interface Props {
  path: Path
  user: Author
  saving?: boolean
  dirty?: boolean
  handleUpdate: (p: Path) => Promise<void>
}

const EditPathPage = ({ path, user, handleUpdate, saving, dirty }: Props) => {
  const router = useRouter()
  const toast = useToast()
  const [title, setTitle] = useState(path.title?.trim() || '')
  const [units, setUnits] = useState(path.units || [])
  const [isPrivate, setIsPrivate] = useState<boolean>(path.private || true)
  const [lessonsByUid, setLessonsByUid] = useState<{ [uid: string]: Lesson }>(
    {}
  )
  const [lessonsLoading, setLessonsLoading] = useState(false)
  const [isFiringConfetti, setIsFiringConfetti] = useState(false)

  const addUnit = () => {
    setUnits([...units, { uid: uuid() } as Unit])
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const newUnits = [...units]
    const [reorderedItem] = newUnits.splice(result.source.index, 1)
    newUnits.splice(result.destination.index, 0, reorderedItem)
    setUnits(newUnits)
    await handleUpdate({ ...path, units: newUnits })
  }

  const onUnitUpdate = async (unit: Unit, index: number) => {
    const unitsClone = [...units]
    unitsClone[index] = unit
    setUnits(unitsClone)
    await handleUpdate({ ...path, units: unitsClone })
  }

  const onUnitDelete = async (index: number) => {
    const unitsClone = [...units]
    unitsClone.splice(index, 1)
    setUnits(unitsClone)
    await handleUpdate({ ...path, units: unitsClone })
  }

  const handleTitleChange = async (title: string) => {
    setTitle(title)
    await handleUpdate({ ...path, title })
  }

  useEffect(() => {
    const toFetch: string[] = []
    for (const unit of units) {
      for (const lessonId of unit.lessonIds || []) {
        if (!lessonsByUid[lessonId]) toFetch.push(lessonId)
      }
    }

    if (toFetch.length) {
      setLessonsLoading(true)
      const fetchLessons = async () => {
        const promises = []
        for (const lessonUid of toFetch) {
          promises.push(getLesson(lessonUid))
        }
        const clone = { ...lessonsByUid }
        const newLessons = await Promise.all(promises)
        for (const lesson of newLessons) {
          clone[lesson.uid] = lesson
        }
        setLessonsByUid(clone)
        setLessonsLoading(false)
      }
      fetchLessons()
    }
  }, [lessonsByUid, units])

  const canPublish =
    path.title && path.units?.length && path.units?.[0]?.lessonIds?.length

  const toggleIsPrivate = async () => {
    const p = !isPrivate
    setIsPrivate(p)
    await handleUpdate({ ...path, private: p })
    if (p) {
      toast({
        title: 'Path set to private.',
      })
    } else {
      toast({ title: 'Path published!', status: 'success' })
      setIsFiringConfetti(true)
      setTimeout(() => setIsFiringConfetti(false), 300)
    }
  }

  return (
    <>
      {lessonsLoading && <Spinner />}
      <Layout withFooter={false}>
        <div className="flex">
          <div className="flex flex-col flex-grow gap-2 overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <TextareaAutosize
                autoFocus
                className={`${computeClassesForTitle(
                  title
                )} font-bold flex-grow resize-none tracking-tighter leading-tight border-0 mb-4`}
                placeholder="Add a title to your path..."
                value={title}
                onChange={({ target }) => handleTitleChange(target.value)}
              />
            </div>
            {/* <div className="flex items-center justify-end gap-2">
              <div
                className={classNames(
                  'flex items-center gap-2 text-base mr-2 py-2',
                  {
                    invisible: !saving,
                  }
                )}
              >
                Saving...
                <Spinner />
              </div>
            </div> */}
            {!units.length && <span className="text-zinc-700">(no units)</span>}
            <DragDropContext onDragEnd={onDragEnd}>
              <div>
                <Droppable droppableId="units">
                  {(provided: DroppableProvided) => (
                    <div
                      className=" units"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {units.map((u, index) => (
                        <Draggable
                          key={u.uid}
                          draggableId={u.uid}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <span
                              className={classNames({
                                'bg-zinc-50 shadow-xl rounded-xl p-4':
                                  snapshot.isDragging,
                              })}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <UnitEditor
                                unitNumber={index + 1}
                                unit={u}
                                lessonsByUid={lessonsByUid}
                                user={user}
                                onUpdate={(u) => onUnitUpdate(u, index)}
                                onDelete={() => onUnitDelete(index)}
                                parentDragHandleProps={provided.dragHandleProps}
                              />
                            </span>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Button
                  className="flex items-center gap-1 my-8 w-fit-content"
                  colorScheme="black"
                  onClick={() => addUnit()}
                >
                  <PlusIcon className="w-4 h-4" />
                  Add unit
                </Button>
              </div>
            </DragDropContext>
          </div>
        </div>
        <footer className="fixed bottom-0 left-0 z-20 w-full h-16 bg-white border-t border-accent-2">
          <Container className="flex items-center justify-end h-full">
            <div className="flex items-center gap-2 mr-auto italic text-zinc-500">
              {saving && (
                <div className="flex items-center gap-2">
                  Saving... <Spinner />
                </div>
              )}
              {dirty && !saving && (
                <>
                  <Text>Unsaved changes...</Text>
                </>
              )}
              {!dirty && !saving && (
                <>
                  <CheckIcon className="w-5 h-5" />
                  <Text>Autosaved!</Text>
                </>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(pathRoute(path.uid))}
              disabled={saving}
              colorScheme="black"
              className="flex items-center justify-between gap-2 mr-4 font-semibold disabled:opacity-50"
            >
              <ExternalLinkIcon className="w-5 h-5" />
              Preview
            </Button>
            {isPrivate && (
              <Button
                colorScheme="black"
                disabled={saving || !canPublish}
                className="flex items-center justify-between font-semibold disabled:opacity-50"
                onClick={toggleIsPrivate}
              >
                <UploadIcon className="w-5 h-5 mr-2" />
                Publish
              </Button>
            )}
            {!isPrivate && (
              <Button
                colorScheme="black"
                disabled={saving}
                className="flex items-center justify-between font-semibold disabled:opacity-50"
                onClick={toggleIsPrivate}
              >
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Make private
              </Button>
            )}
          </Container>
        </footer>
        <Portal>
          <Confetti isFiring={isFiringConfetti} />
        </Portal>
      </Layout>
    </>
  )
}

export default EditPathPage
