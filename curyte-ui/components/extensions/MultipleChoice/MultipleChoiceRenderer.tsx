import { Editor, NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { MultipleChoiceAttrs } from './MultipleChoiceAttrs'
import MultipleChoiceEditorComponent from './MultipleChoiceEditorComponent'
import MultipleChoiceComponent from './MutlipleChoiceComponent'

export interface MultipleChoiceRendererProps {
  editor: Editor
  node: {
    attrs: MultipleChoiceAttrs
    nodeSize: number
  }
  updateAttributes: (attr: MultipleChoiceAttrs) => void
}

const MultipleChoiceRenderer = ({
  editor,
  node,
  updateAttributes,
}: MultipleChoiceRendererProps) => (
  <NodeViewWrapper>
    <NodeViewContent>
      <div
        className="p-4 my-4 rounded-xl border-2 border-zinc-200"
        data-drag-handle=""
      >
        {editor.isEditable && (
          <MultipleChoiceEditorComponent
            {...node.attrs}
            onUpdate={(attrs) => {
              console.log(attrs)
              updateAttributes(attrs)
            }}
          />
        )}
        {!editor.isEditable && <MultipleChoiceComponent {...node.attrs} />}
      </div>
    </NodeViewContent>
  </NodeViewWrapper>
)

export default MultipleChoiceRenderer
