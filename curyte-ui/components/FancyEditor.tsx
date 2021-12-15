import { EditorContent, FloatingMenu, Editor } from '@tiptap/react'
import React from 'react'
import FancyEditorMenuBar from './FancyEditorMenuBar'
import TextBubbleMenu from './extensions/BubbleMenu/TextBubbleMenu'

// import AddButton from './popovers/AddButton'
// import DeleteButton from './popovers/DeleteButton'

interface Props {
  editor: Editor | null
  readOnly?: boolean
}

// function shouldShowPopover(editor: Editor) {
//   return editor.state.selection.$anchor.parent.type.name === 'paragraph'
// }

const FancyEditor = ({ editor, readOnly }: Props) => {
  return (
    <>
      <div className="flex flex-col min-w-full">
        {!readOnly && <FancyEditorMenuBar editor={editor} />}
        <EditorContent className="markdown-body" editor={editor} />
        {editor && (
          <>
            {!readOnly && <TextBubbleMenu editor={editor} />}
            <FloatingMenu editor={editor}>
              {/* {shouldShowPopover(editor) && ( */}
              <div
                style={{ position: 'absolute', top: -15, left: -100 }}
                className="flex gap-1 items-center"
              >
                {/* <AddButton
      onClick={() => {
        console.error('unimplemented')
      }}
    /> */}
                {/* <DeleteButton
      onClick={() => {
        const { empty, anchor } = editor.state.selection

        if (!empty) {
          return false
        }

        let isBackspaceHandled = false

        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          if (node.type.name === 'emojiReplacer') {
            tr.deleteRange(pos, pos + node.nodeSize)
            isBackspaceHandled = true
            return false
          }
        })
      }}
      //ref={sideBarControls}
      // editor={editor}
      // display={true || 'displaySidebar'}
    /> */}
              </div>
              {/* )} */}
            </FloatingMenu>
          </>
        )}
      </div>
    </>
  )
}

export default FancyEditor
