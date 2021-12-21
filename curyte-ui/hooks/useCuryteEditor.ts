import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Superscript from '@tiptap/extension-superscript'
import TableCell from '@tiptap/extension-table-cell'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { DependencyList } from 'react'
import { GoogleDriveEmbed } from '../components/embeds/GoogleDriveEmbed'
import { IFrameEmbed } from '../components/embeds/IFrameEmbed'
import { ImageEmbed } from '../components/embeds/ImageEmbed'
import VimeoEmbed from '../components/embeds/VimeoEmbed'
import Document from '../components/extensions/Document'
import { YoutubeEmbed } from '../components/embeds/YoutubeEmbed'
import AutoId from '../components/extensions/AutoId'
import Link from '@tiptap/extension-link'
import { CuryteLink } from '../components/extensions/CuryteLink/CuryteLink'
import { MultipleChoice } from '../components/extensions/MultipleChoice/MultipleChoice'
import { indigo } from '../styles/theme/colors'

interface EditorProps {
  content: JSONContent | null
  onUpdate?: (json: JSONContent) => void
}

const useCuryteEditor = (
  { content, onUpdate }: EditorProps,
  deps: DependencyList = []
) => {
  return useEditor(
    {
      extensions: [
        Highlight,
        Typography,
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
        CuryteLink,
        VimeoEmbed,
        StarterKit.configure({
          document: false,
          dropcursor: {
            color: indigo[500],
          },
        }),
        Document,
        GoogleDriveEmbed,
        ImageEmbed,
        TaskList,
        AutoId,
        TaskItem.configure({
          nested: true,
        }),
        Placeholder.configure({
          showOnlyWhenEditable: true,
          placeholder: 'What are you teaching today?',
        }),
        MultipleChoice,
      ],
      content,
      editable: !!onUpdate,
      onUpdate: ({ editor }) => {
        if (onUpdate) onUpdate(editor.getJSON())
      },
    },
    deps
  )
}

export default useCuryteEditor
