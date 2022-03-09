import { JSONContent } from '@tiptap/core'
import useCuryteEditor from '../hooks/useCuryteEditor'
import SimpleEditor from './SimpleEditor'

interface Props {
  content: JSONContent | null
}

const NotesRenderer = ({ content }: Props) => {
  const editor = useCuryteEditor({ content }, [content])

  return <SimpleEditor editor={editor} readOnly />
}

export default NotesRenderer
