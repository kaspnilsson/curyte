import {
  useEditor,
  EditorContent,
  JSONContent,
  FloatingMenu,
} from '@tiptap/react'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import { IFrameEmbed } from './embeds/IFrameEmbed'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import FancyEditorMenuBar from './FancyEditorMenuBar'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { YoutubeEmbed } from './embeds/YoutubeEmbed'
import { GoogleDriveEmbed } from './embeds/GoogleDriveEmbed'
import { ImageEmbed } from './embeds/ImageEmbed'
import VimeoEmbed from './embeds/VimeoEmbed'
import Document from './extensions/Document'
import Color from '@tiptap/extension-color'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Underline from '@tiptap/extension-underline'
import TextBubbleMenu from './extensions/BubbleMenu/TextBubbleMenu'
import TableOfContents from './extensions/TableOfContents/TableOfContents'
// import AddButton from './popovers/AddButton'
// import DeleteButton from './popovers/DeleteButton'

interface Props {
  content: JSONContent | null
  onUpdate?: (json: JSONContent) => void
  readOnly?: boolean
}

// function shouldShowPopover(editor: Editor) {
//   return editor.state.selection.$anchor.parent.type.name === 'paragraph'
// }

const FancyEditor = ({ content, onUpdate, readOnly }: Props) => {
  const editor = useEditor({
    extensions: [
      Highlight,
      Typography,
      // Image,
      // TextAlign,
      Link,
      Superscript,
      Table.configure({ resizable: true }),
      TableCell,
      TableHeader,
      TableRow,
      IFrameEmbed,
      YoutubeEmbed,
      Color,
      Underline,
      VimeoEmbed,
      StarterKit.configure({
        document: false,
      }),
      Document,
      GoogleDriveEmbed,
      TableOfContents,
      // Dropcursor.configure({
      //   color: '#6a7280',
      // }),
      ImageEmbed,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        showOnlyWhenEditable: true,
        placeholder: 'What are you teaching today?',
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (onUpdate) onUpdate(editor.getJSON())
    },
  })

  return (
    <>
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
    </>
  )
}

export default FancyEditor
