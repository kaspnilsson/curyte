import { JSONContent } from '@tiptap/core'
import { useUserAndProfile } from '../contexts/user'
import useCuryteEditor from '../hooks/useCuryteEditor'
import { Notes } from '../interfaces/notes_with_profile'
import { userIsAdmin } from '../utils/hacks'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import FeedbackEditor from './FeedbackEditor'
import FeedbackRenderer from './FeedbackRenderer'
import LessonLink from './LessonLink'
import SimpleEditor from './SimpleEditor'

interface Props {
  notes: Notes
  titleMode?: 'lesson' | 'author'
}

const NotesRenderer = ({ notes, titleMode = 'author' }: Props) => {
  const readonlyEditor = useCuryteEditor(
    { content: notes.content ? (notes.content as JSONContent) : null },
    [notes]
  )
  const { userAndProfile } = useUserAndProfile()

  if (!userAndProfile?.user) return null
  const showFeedbackEditor =
    userIsAdmin(userAndProfile.user.id) ||
    (notes.userId !== userAndProfile.user.id &&
      notes.lessons &&
      notes.lessons.authorId === userAndProfile.user.id)
  return (
    <div className="w-full overflow-hidden shadow-lg rounded-xl">
      <div className="flex items-center justify-between p-4 bg-zinc-100">
        {titleMode === 'author' && (
          <AuthorLink author={notes.profiles} smallerPic />
        )}
        {titleMode === 'lesson' && notes.lessons && (
          <LessonLink lesson={notes.lessons} />
        )}
        <div className="pl-2 text-sm text-right text-zinc-700">
          <DateFormatter date={notes.updated} />
        </div>
      </div>
      <div className="p-4 bg-zinc-50">
        <SimpleEditor editor={readonlyEditor} readOnly />
        {showFeedbackEditor && (
          <div className="border-t">
            <FeedbackEditor inResponseTo={notes.uid} />
          </div>
        )}
      </div>
      {(notes.feedback || [])
        .filter((f) => !!f.content)
        .map((f, index) => (
          <div className="border-t" key={index}>
            <FeedbackRenderer feedback={f} />
          </div>
        ))}
    </div>
  )
}

export default NotesRenderer
