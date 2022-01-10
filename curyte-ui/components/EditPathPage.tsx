import { Author } from '../interfaces/author'
import { Path, Unit } from '../interfaces/path'
import Layout from './Layout'
import { computeClassesForTitle } from './LessonTitle'
import TextareaAutosize from 'react-textarea-autosize'
import { useEffect, useState } from 'react'
import { Button, Spinner } from '@chakra-ui/react'
import { PlusIcon } from '@heroicons/react/outline'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd'
import UnitEditor from './UnitEditor'
import { Lesson } from '../interfaces/lesson'
import { getLessons } from '../firebase/api'
import { where } from 'firebase/firestore'
import classNames from 'classnames'
import PathActions from './PathActions'
import { uuid } from '../utils/uuid'

interface Props {
  path: Path
  user: Author
  saving?: boolean
  handleUpdate: (p: Path) => Promise<void>
}

const EditPathPage = ({ path, user, handleUpdate, saving }: Props) => {
  const [title, setTitle] = useState(path.title?.trim() || '')
  const [units, setUnits] = useState(path.units || [])
  const [lessonsByUid, setLessonsByUid] = useState<{ [uid: string]: Lesson }>(
    {}
  )
  const [lessonsLoading, setLessonsLoading] = useState(false)

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
        const newLessons = await getLessons([where('uid', 'in', toFetch)])
        const clone = { ...lessonsByUid }
        for (const lesson of newLessons) {
          clone[lesson.uid] = lesson
        }
        setLessonsByUid(clone)
        setLessonsLoading(false)
      }
      fetchLessons()
    }
  }, [lessonsByUid, units])

  return (
    <>
      {lessonsLoading && <Spinner />}
      <Layout sidebar={<div></div>}>
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
            <div className="flex items-center justify-end gap-2">
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
              <PathActions path={path} />
            </div>
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
      </Layout>
    </>
  )
}

export default EditPathPage
