import { JSONContent } from '@tiptap/core'
import { useUserAndProfile } from '../contexts/user'
import useCuryteEditor from '../hooks/useCuryteEditor'
import { Feedback } from '../interfaces/feedback_with_profile'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import SimpleEditor from './SimpleEditor'

interface Props {
  feedback: Feedback
  //   titleMode?: 'lesson' | 'author'
}

const FeedbackRenderer = ({ feedback }: Props) => {
  const readonlyEditor = useCuryteEditor(
    { content: feedback.content ? (feedback.content as JSONContent) : null },
    [feedback]
  )
  const { userAndProfile } = useUserAndProfile()

  if (!userAndProfile?.user) return null
  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 bg-zinc-100">
        <AuthorLink author={feedback.profiles} smallerPic />
        <div className="pl-2 text-sm text-right text-zinc-700">
          <DateFormatter date={feedback.updated} />
        </div>
      </div>
      <div className="p-4 bg-zinc-50">
        <SimpleEditor editor={readonlyEditor} readOnly />
      </div>
    </div>
  )
}

export default FeedbackRenderer
