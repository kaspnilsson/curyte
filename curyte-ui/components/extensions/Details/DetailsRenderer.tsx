import { IconButton } from '@chakra-ui/react'
import { NodeViewWrapper, NodeViewContent, Editor } from '@tiptap/react'
import { useState, KeyboardEvent } from 'react'
import { DetailsAttrs } from './DetailsAttrs'
import TextareaAutosize from 'react-textarea-autosize'

export interface DetailsRendererProps {
  editor: Editor
  node: {
    attrs: DetailsAttrs
  }
  updateAttributes: (attr: DetailsAttrs) => void
}

const DetailsWrapper = ({
  editor,
  node,
  updateAttributes,
}: DetailsRendererProps) => {
  const { isOpen, summary } = node.attrs
  const [open, setOpen] = useState(isOpen)
  const handleSetOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    if (editor.isEditable) {
      updateAttributes({ ...node.attrs, isOpen })
    }
  }
  const handleSummaryUpdate = (val: string) => {
    updateAttributes({ ...node.attrs, summary: val })
  }
  const handleInputKeydown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleSetOpen(!open)
    }
  }
  return (
    <NodeViewWrapper>
      <div className="grid grid-cols-[min-content_1fr] items-center gap-2 p-4 my-4 border-2 rounded-xl border-zinc-200">
        <IconButton
          contentEditable={false}
          aria-label="Expand toggle"
          colorScheme="black"
          variant="ghost"
          className="flex-1 h-full"
          icon={<span>{open ? '▼' : '▶'}</span>}
          onClick={() => handleSetOpen(!open)}
        />
        {editor.isEditable && (
          <TextareaAutosize
            autoFocus
            className="w-full text-lg font-bold leading-tight tracking-tighter border-0 resize-none"
            value={summary}
            placeholder="Ask a question..."
            onChange={({ currentTarget }) =>
              handleSummaryUpdate(currentTarget.value)
            }
            onKeyDown={handleInputKeydown}
          />
        )}
        {!editor.isEditable && (
          <summary
            className="w-full text-lg font-bold leading-tight tracking-tighter list-none cursor-pointer"
            onClick={() => handleSetOpen(!open)}
          >
            {summary}
          </summary>
        )}
        {open && (
          <NodeViewContent className="w-full col-start-2 details-content"></NodeViewContent>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export default DetailsWrapper
