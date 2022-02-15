import { NodeViewWrapper } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { Spinner } from '@chakra-ui/react'
import LessonPreview from '../../LessonPreview'
import { getLesson } from '../../../lib/apiHelpers'
import { LessonWithProfile } from '../../../interfaces/lesson_with_profile'

const CuryteLinkRenderer = (props: {
  node: { attrs: { lessonId: string; href: string } }
}) => {
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState<LessonWithProfile | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const l = await getLesson(props.node.attrs.lessonId)
      setLesson(l)
      setLoading(false)
    }
    setLoading(true)
    fetch()
  }, [props.node.attrs.lessonId])

  return (
    <NodeViewWrapper>
      <div
        contentEditable={false}
        className="flex justify-center p-2 not-prose"
        data-drag-handle=""
      >
        {loading && <Spinner color="black" size="xl" />}
        {!loading && lesson && <LessonPreview lesson={lesson} />}
      </div>
    </NodeViewWrapper>
  )
}

export default CuryteLinkRenderer
