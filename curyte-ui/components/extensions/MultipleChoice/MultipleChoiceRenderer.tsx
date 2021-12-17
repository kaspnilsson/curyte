import { Editor, NodeViewWrapper } from '@tiptap/react'
import { MultipleChoiceAttrs } from './MultipleChoiceAttrs'
import MultipleChoiceEditorComponent from './MultipleChoiceEditorComponent'
import MultipleChoiceComponent from './MutlipleChoiceComponent'

export interface MultipleChoiceRendererProps {
  editor: Editor
  node: {
    attrs: MultipleChoiceAttrs
    nodeSize: number
  }
  getPos: () => number
  selected: boolean
  updateAttributes: (attr: MultipleChoiceAttrs) => void
}

const MultipleChoiceRenderer = ({
  editor,
  getPos,
  node,
  updateAttributes,
  selected,
}: MultipleChoiceRendererProps) => (
  <>
    {editor.isEditable && <MultipleChoiceEditorComponent {...node.attrs} />}
    {!editor.isEditable && <MultipleChoiceComponent {...node.attrs} />}
  </>
)

export default MultipleChoiceRenderer
