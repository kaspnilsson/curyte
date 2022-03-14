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
import { JSONContent, mergeAttributes, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { DependencyList } from 'react'
import { GoogleDriveEmbed } from '../components/embeds/GoogleDriveEmbed'
import { IFrameEmbed } from '../components/embeds/IFrameEmbed'
import VimeoEmbed from '../components/embeds/VimeoEmbed'
import { YoutubeEmbed } from '../components/embeds/YoutubeEmbed'
import AutoId from '../components/extensions/AutoId'
import Link from '@tiptap/extension-link'
import { CuryteLink } from '../components/extensions/CuryteLink/CuryteLink'
import { MultipleChoice } from '../components/extensions/MultipleChoice/MultipleChoice'
import { zinc } from '../styles/theme/colors'
import Details from '../components/extensions/Details/Details'
import DetailsContent from '../components/extensions/Details/DetailsContent'
import { getCurrentlySelectedNodes } from '../utils/prosemirror'
import { uploadFile } from '../utils/upload-image'
import CuryteImage from '../components/extensions/Image/CuryteImage'
import Heading from '@tiptap/extension-heading'
import { useToast } from '@chakra-ui/react'
import { TrailingNode } from '../components/extensions/TrailingNode'
import Notice from '../components/extensions/Notice/Notice'
import NoticeContent from '../components/extensions/Notice/NoticeContent'

interface EditorProps {
  content: JSONContent | null
  onUpdate?: (json: JSONContent) => void
  fancy?: boolean
}

const useCuryteEditor = (
  { content, onUpdate, fancy = true }: EditorProps,
  deps: DependencyList = []
) => {
  const toast = useToast()

  const extensions = [
    Highlight,
    Typography,
    Link,
    Superscript,
    Subscript,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    Color,
    Underline,
    StarterKit.configure({
      dropcursor: {
        color: zinc[500],
      },
      heading: false,
    }),
    Heading.extend({
      // Force headings to be one level lower, as we only offer three and
      renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level)
        const level = hasLevel ? node.attrs.level : this.options.levels[0]

        return [
          `h${level + 1}`,
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
          0,
        ]
      },
    }).configure({ levels: [1, 2, 3] }),
    CuryteImage(
      (image: File) =>
        new Promise((resolve, reject) => {
          uploadFile(
            image,
            (progress: number) => {
              console.log('progress: ', progress)
            },
            (url: string) => {
              toast({ title: 'Image uploaded!', status: 'success' })
              resolve(url)
            },
            reject
          )
        })
    ),
    TaskList,
    AutoId,
    TaskItem.configure({
      nested: true,
    }),
    TrailingNode,
  ]

  if (fancy) {
    extensions.push(
      ...[
        Details,
        DetailsContent,
        Focus.configure({
          mode: 'deepest',
        }),
        IFrameEmbed,
        YoutubeEmbed,
        CuryteLink,
        Notice,
        NoticeContent,
        VimeoEmbed,
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
        GoogleDriveEmbed,
      ]
    )
  } else {
    extensions.push(
      ...[
        Placeholder.configure({
          showOnlyWhenEditable: true,
          placeholder: 'Add notes',
        }),
      ]
    )
  }

  return useEditor(
    {
      extensions,
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
