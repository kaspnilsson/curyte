import { Author } from '../interfaces/author'
import { Lesson } from '../interfaces/lesson'
import LessonPreview from './LessonPreview'

interface Props {
  lessons?: Lesson[]
  authors?: Author[]
  pathId?: string
}

const LessonList = ({ lessons = [], authors = [], pathId = '' }: Props) => (
  <div className="flex flex-wrap max-w-full gap-12">
    {!!lessons.length &&
      lessons.map((l, key) => (
        <LessonPreview
          key={key}
          lesson={l}
          author={authors.find((a) => a.uid === l.authorId) || null}
          pathId={pathId}
        />
      ))}
  </div>
)

export default LessonList
