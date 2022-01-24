import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TableCell from '@tiptap/extension-table-cell'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Focus from '@tiptap/extension-focus'
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
import { zinc } from '../styles/theme/colors'
import { TrailingNode } from '../components/extensions/TrailingNode'
import PasteHandler from '../components/extensions/HandlePaste/HandlePaste'
import Details from '../components/extensions/Details/Details'
import DetailsContent from '../components/extensions/Details/DetailsContent'
import { getCurrentlySelectedNodes } from '../utils/prosemirror'

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
        Details,
        DetailsContent,
        Typography,
        Link,
        Superscript,
        Subscript,
        Table,
        TableCell,
        TableHeader,
        TableRow,
        IFrameEmbed,
        YoutubeEmbed,
        Color,
        Focus.configure({
          mode: 'deepest',
        }),
        Underline,
        PasteHandler,
        CuryteLink,
        VimeoEmbed,
        StarterKit.configure({
          document: false,
          dropcursor: {
            color: zinc[500],
          },
        }),
        Document,
        GoogleDriveEmbed,
        ImageEmbed,
        TaskList,
        AutoId,
        TrailingNode,
        TaskItem.configure({
          nested: true,
        }),
        Placeholder.configure({
          showOnlyWhenEditable: true,
          placeholder: ({ editor, node, pos }) => {
            if (node.type.name === 'heading') {
              if (pos === 0) return 'Add your first section header...'
              if (node.attrs.level === 1) return 'Add section header...'
              return 'Add section subheader...'
            }
            if (node.type.name === 'paragraph') {
              const nodes = getCurrentlySelectedNodes(
                editor.state.doc.resolve(pos)
              )
              for (const n of nodes) {
                if (n.type.name === 'table') {
                  return ''
                }
              }
              return 'Type anywhere or use [ insert ] to add new elements.'
            }
            return ''
          },
          showOnlyCurrent: false,
          includeChildren: true,
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
