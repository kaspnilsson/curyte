import * as api from '../../../firebase/api'
import { NodeViewWrapper } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { Lesson } from '../../../interfaces/lesson'
import LessonLink from '../../LessonLink'
import { Spinner } from '@chakra-ui/react'

const CuryteLinkRenderer = (props: {
  node: { attrs: { lessonId: string; href: string } }
}) => {
  const [loading, setLoading] = useState(false)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  useEffect(() => {
    const fetch = async () => {
      setLesson(await api.getLesson(props.node.attrs.lessonId))
      setLoading(false)
    }
    setLoading(true)
    fetch()
  }, [props.node.attrs.lessonId])
  return (
    <NodeViewWrapper>
      <>
        {loading && <Spinner color="purple" size="xs" />}{' '}
        {!loading && lesson && <LessonLink lesson={lesson} />}
      </>
    </NodeViewWrapper>
  )
}

export default CuryteLinkRenderer
