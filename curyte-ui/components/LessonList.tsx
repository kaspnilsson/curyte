import { Author } from '../interfaces/author'
import { Lesson } from '../interfaces/lesson'
import LessonPreview from './LessonPreview'

interface Props {
  lessons?: Lesson[]
  authors?: Author[]
  pathId?: string
  onSelectLesson?: (l: Lesson) => void
}

const LessonList = ({
  lessons = [],
  authors = [],
  pathId = '',
  onSelectLesson,
}: Props) => (
  <div className="flex flex-wrap w-full divide-y">
    {!!lessons.length &&
      lessons.map((l, key) => (
        <LessonPreview
          key={key}
          lesson={l}
          author={authors.find((a) => a.uid === l.authorId) || null}
          pathId={pathId}
          onClick={onSelectLesson}
        />
      ))}
  </div>
)

export default LessonList
