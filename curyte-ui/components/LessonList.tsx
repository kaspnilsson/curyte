import { Lesson } from '@prisma/client'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import LessonPreview from './LessonPreview'

interface Props {
  lessons?: LessonWithProfile[]
  pathId?: string
  onSelectLesson?: (l: Lesson) => void
  small?: boolean
}

const LessonList = ({
  lessons = [],
  pathId = '',
  onSelectLesson,
  small = false,
}: Props) => (
  <div className="flex flex-wrap w-full divide-y">
    {!!lessons.length &&
      lessons.map((l, key) => (
        <LessonPreview
          key={key}
          lesson={l}
          pathId={pathId}
          onClick={onSelectLesson}
          small={small}
        />
      ))}
  </div>
)

export default LessonList
