import * as api from '../../../firebase/api'
import { NodeViewWrapper } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { Lesson } from '../../../interfaces/lesson'
import { Spinner } from '@chakra-ui/react'
import LessonPreview from '../../LessonPreview'
import { Author } from '../../../interfaces/author'

const CuryteLinkRenderer = (props: {
  node: { attrs: { lessonId: string; href: string } }
}) => {
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [author, setAuthor] = useState<Author | null>(null)
  useEffect(() => {
    const fetch = async () => {
      const l = await api.getLesson(props.node.attrs.lessonId)
      setLesson(l)
      setAuthor(await api.getAuthor(l.authorId))
      setLoading(false)
    }
    setLoading(true)
    fetch()
  }, [props.node.attrs.lessonId])
  return (
    <NodeViewWrapper>
      <div contentEditable={false} className="p-2">
        {loading && <Spinner color="purple" size="xl" />}
        {!loading && lesson && (
          <LessonPreview lesson={lesson} author={author} />
        )}
      </div>
    </NodeViewWrapper>
  )
}

export default CuryteLinkRenderer
