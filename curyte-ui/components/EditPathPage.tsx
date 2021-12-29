import { Author } from '../interfaces/author'
import { Path, Unit } from '../interfaces/path'
import Layout from './Layout'
import { computeClassesForTitle } from './LessonTitle'
import TextareaAutosize from 'react-textarea-autosize'
import { useEffect, useState } from 'react'
import Container from './Container'
import { Accordion, Button } from '@chakra-ui/react'
import { PlusIcon } from '@heroicons/react/outline'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import UnitEditor from './UnitEditor'
import { Lesson } from '../interfaces/lesson'
import { getLessons } from '../firebase/api'
import { where } from 'firebase/firestore'

interface Props {
  path: Path
  user: Author
  handleUpdate: (p: Path) => Promise<void>
}

const EditPathPage = ({ path, user, handleUpdate }: Props) => {
  const [title, setTitle] = useState(path.title?.trim() || '')
  const [units, setUnits] = useState(path.units || [])
  const [lessonsByUid, setLessonsByUid] = useState<{ [uid: string]: Lesson }>(
    {}
  )

  const addUnit = () => {
    setUnits([...units, { uid: uuidv4() } as Unit])
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    console.error('todo')
  }

  const onUnitUpdate = async (unit: Unit, index: number) => {
    const unitsClone = [...units]
    unitsClone[index] = unit
    setUnits(unitsClone)
    await handleUpdate({ ...path, units: unitsClone })
  }

  useEffect(() => {
    const toFetch: string[] = []
    for (const unit of units) {
      for (const lessonId of unit.lessonIds || []) {
        if (!lessonsByUid[lessonId]) toFetch.push(lessonId)
      }
    }

    if (toFetch.length) {
      const fetchLessons = async () => {
        const newLessons = await getLessons([where('uid', 'in', toFetch)])
        const clone = { ...lessonsByUid }
        for (const lesson of newLessons) {
          clone[lesson.uid] = lesson
        }
        setLessonsByUid(clone)
      }
      fetchLessons()
    }
  }, [lessonsByUid, units])

  return (
    <Layout>
      <Container className="px-5">
        <div className="flex">
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <TextareaAutosize
                autoFocus
                className={`${computeClassesForTitle(
                  title
                )} font-semibold flex-grow resize-none tracking-tight leading-tight border-0`}
                placeholder="Add a title to your path..."
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div className="flex flex-col gap-8 py-8">
              <DragDropContext onDragEnd={onDragEnd}>
                <div>
                  <Droppable droppableId="units">
                    {(provided: DroppableProvided) => (
                      <Accordion
                        allowMultiple
                        allowToggle
                        className="my-8 units"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {units.map((u, index) => (
                          <Draggable
                            key={u.uid}
                            draggableId={u.uid}
                            index={index}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <UnitEditor
                                  unit={u}
                                  lessonsByUid={lessonsByUid}
                                  user={user}
                                  onUpdate={(u) => onUnitUpdate(u, index)}
                                />
                              </span>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Accordion>
                    )}
                  </Droppable>
                  <Button
                    className="flex items-center gap-1 w-fit-content"
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
        </div>
      </Container>
    </Layout>
  )
}

export default EditPathPage
