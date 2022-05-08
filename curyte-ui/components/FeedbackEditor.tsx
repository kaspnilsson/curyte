import { useDebounceCallback } from '@react-hook/debounce'
import { JSONContent } from '@tiptap/core'
import { useState, useEffect } from 'react'
import { useUserAndProfile } from '../contexts/user'
import useCuryteEditor from '../hooks/useCuryteEditor'
import { Feedback } from '../interfaces/feedback_with_profile'
import { getFeedback, updateFeedback } from '../lib/apiHelpers'
import SimpleEditor from './SimpleEditor'

interface Props {
  inResponseTo: string
}

const FeedbackEditor = ({ inResponseTo }: Props) => {
  const { userAndProfile } = useUserAndProfile()
  const user = userAndProfile?.user
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  useEffect(() => {
    let isCancelled = false
    const fetchFeedback = async () => {
      if (!inResponseTo) return
      const f = await getFeedback(inResponseTo)
      if (f && !isCancelled) {
        setFeedback(f)
      }
    }
    fetchFeedback()
    return () => {
      isCancelled = true
    }
  }, [inResponseTo])

  const handleContentUpdate = useDebounceCallback(
    async (content: JSONContent) => {
      await updateFeedback(inResponseTo, content)
    },
    200
  )

  const editor = useCuryteEditor(
    {
      content: feedback?.content ? (feedback.content as JSONContent) : null,
      onUpdate: handleContentUpdate,
      fancy: false,
      placeholder: 'Add feedback',
    },
    [feedback, handleContentUpdate]
  )

  if (!user) return null
  return (
    (editor && <SimpleEditor editor={editor} withToolbar={false} />) || null
  )
}

export default FeedbackEditor
