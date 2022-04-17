import { Editor, NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { CuryteImageAttrs } from './CuryteImageAttrs'
import CuryteImageEditorComponent from './CuryteImageEditorComponent'
import CuryteImageComponent from './CuryteImageComponent'

export interface CuryteImageRendererProps {
  editor: Editor
  node: {
    attrs: CuryteImageAttrs
  }
  selected: boolean
  updateAttributes: (attr: CuryteImageAttrs) => void
}

const CuryteImageRenderer = ({
  editor,
  node,
  selected,
  updateAttributes,
}: CuryteImageRendererProps) => (
  <NodeViewWrapper>
    <NodeViewContent>
      <div data-drag-handle="">
        {editor.isEditable && (
          <CuryteImageEditorComponent
            {...node.attrs}
            onUpdate={(attrs) => {
              updateAttributes(attrs)
            }}
            selected={selected}
            editor={editor}
          />
        )}
        {!editor.isEditable && <CuryteImageComponent {...node.attrs} />}
      </div>
    </NodeViewContent>
  </NodeViewWrapper>
)

export default CuryteImageRenderer
