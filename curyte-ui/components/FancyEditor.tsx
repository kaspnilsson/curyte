import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import { IFrameEmbed } from './embeds/IFrameEmbed'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import FancyEditorMenuBar from './FancyEditorMenuBar'
import { YoutubeEmbed } from './embeds/YoutubeEmbed'
import { GoogleDriveEmbed } from './embeds/GoogleDriveEmbed'
import { ImageEmbed } from './embeds/ImageEmbed'
import VimeoEmbed from './embeds/VimeoEmbed'

interface Props {
  content: JSONContent | null
  onUpdate?: (json: JSONContent) => void
  readOnly?: boolean
}

const FancyEditor = ({ content, onUpdate, readOnly }: Props) => {
  const editor = useEditor({
    extensions: [
      Highlight,
      Typography,
      // Image,
      // TextAlign,
      Link,
      Superscript,
      // Table,
      // TableCell,
      // TableHeader,
      // TableRow,
      // Underline,
      IFrameEmbed,
      YoutubeEmbed,
      VimeoEmbed,
      StarterKit,
      GoogleDriveEmbed,
      ImageEmbed,
      Placeholder.configure({
        showOnlyWhenEditable: true,
        placeholder: 'Write something interesting...',
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
    </>
  )
}

export default FancyEditor
