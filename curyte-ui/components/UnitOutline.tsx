import { Heading } from '@chakra-ui/react'
import { Lesson } from '../interfaces/lesson'
import { Unit } from '../interfaces/path'
import LessonList from './LessonList'

interface Props {
  unit: Unit
  unitIndex: number
  lessonsMap: { [uid: string]: Lesson }
}

const UnitOutline = ({ unit, unitIndex, lessonsMap }: Props) => {
  const unitNumber = unitIndex + 1
  const lessons: Lesson[] = []
  for (const uid of unit.lessonIds || []) {
    lessons.push(lessonsMap[uid])
  }
  return (
    <>
      <div className="flex items-center w-full gap-2 p-4">
        <Heading className="flex flex-1 flex-grow gap-2 font-semibold tracking-tight resize-none leading-tighter">
          <span>{unitNumber}.</span>
          <span>{unit.title || '(no unit title)'}</span>
        </Heading>
      </div>
      <div className="p-4">
        <Heading
          className="font-bold leading-tight tracking-tight"
          fontSize="xl"
        >
          Lessons
        </Heading>
        {!lessons.length && <span className="text-zinc-700">(no lessons)</span>}
        <LessonList lessons={lessons} allowWrap />
      </div>
    </>
  )
}

export default UnitOutline
