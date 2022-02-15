import { Heading } from '@chakra-ui/react'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import { Unit } from '../interfaces/unit'
import LessonList from './LessonList'

interface Props {
  unit: Unit
  unitIndex: number
  lessonsMap: { [uid: string]: LessonWithProfile }
  pathId: string
}

const UnitOutline = ({ unit, unitIndex, lessonsMap, pathId }: Props) => {
  const unitNumber = unitIndex + 1
  const lessons: LessonWithProfile[] = []
  for (const uid of unit.lessonIds || []) {
    lessons.push(lessonsMap[uid])
  }
  return (
    <>
      <div className="flex items-center w-full gap-2 py-4 border-b-2">
        <Heading className="flex flex-wrap flex-1 flex-grow gap-2 font-semibold leading-tight tracking-tighter resize-none">
          <span>{unitNumber}.</span>
          <span className="break-all">{unit.title || '(no unit title)'}</span>
        </Heading>
      </div>
      <div className="p-4">
        {/* <Heading
          className="font-bold leading-tight tracking-tighter"
          fontSize="xl"
        >
          Lessons
        </Heading> */}
        {!lessons.length && <span className="text-zinc-700">(no lessons)</span>}
        <LessonList lessons={lessons} pathId={pathId} />
      </div>
    </>
  )
}

export default UnitOutline
