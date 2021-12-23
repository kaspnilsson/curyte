import classNames from 'classnames'
import { Lesson } from '../interfaces/lesson'
import LessonPreview from './LessonPreview'

interface Props {
  lessons?: Lesson[]
  allowWrap?: boolean
}

const LessonList = ({ lessons = [], allowWrap = false }: Props) => (
  <div
    className={classNames('flex w-full px-8 py-4 my-4', {
      'overflow-x-scroll overscroll-contain hide-scrollbar snap-x snap-left':
        !allowWrap,
    })}
  >
    <div
      className={classNames('flex gap-4 hide-scroll-bar', {
        'flex-nowrap': !allowWrap,
        'flex-wrap justify-center': allowWrap,
      })}
    >
      {!!lessons.length &&
        lessons.map((l, key) => <LessonPreview key={key} lesson={l} />)}
    </div>
  </div>
)

export default LessonList
