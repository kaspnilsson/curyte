import { Lesson } from '../interfaces/lesson'
import LessonPreview from './LessonPreview'

interface Props {
  lessons?: Lesson[]
}

const LessonList = ({ lessons = [] }: Props) => (
  <div className="flex w-full px-8 my-8 overflow-x-scroll overscroll-contain hide-scrollbar snap-x snap-left">
    <div className="flex gap-4 flex-nowrap hide-scroll-bar">
      {!!lessons.length &&
        lessons.map((l, key) => <LessonPreview key={key} lesson={l} />)}
    </div>
  </div>
)

export default LessonList
