import { Lesson } from '@prisma/client'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import LessonPreview from './LessonPreview'

interface Props {
  lessons?: LessonWithProfile[]
  pathId?: string
  onSelectLesson?: (l: Lesson) => void
  noCover?: boolean
}

const LessonList = ({
  lessons = [],
  pathId = '',
  onSelectLesson,
  noCover = false,
}: Props) => (
  <div className="flex flex-wrap w-full">
    {!!lessons.length &&
      lessons.map((l, key) => (
        <LessonPreview
          key={key}
          lesson={l}
          pathId={pathId}
          onClick={onSelectLesson}
          noCover={noCover}
        />
      ))}
  </div>
)

export default LessonList
