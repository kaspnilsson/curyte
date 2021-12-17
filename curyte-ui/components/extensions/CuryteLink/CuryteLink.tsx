import { EditorState } from 'prosemirror-state'
import { Node, mergeAttributes, nodeInputRule, Command } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import CuryteLinkRenderer from './CuryteLinkRenderer'
import { curyteLessonUrlMatchRegex } from '../../embeds/matchers'

// Needed for the find operations performed in this file, as Tiptap library calls matchAll() which requires a global regex
const tiptapFindLessonMatchRegex = new RegExp(
  curyteLessonUrlMatchRegex,
  curyteLessonUrlMatchRegex.flags + 'g'
)

declare module '@tiptap/core' {
  interface Commands {
    curyteLink: {
      setCuryteLink: (options: { src: string }) => Command
    }
  }
}

const getAttributes = (match: string[]) => {
  const [href, , , lessonId] = match
  return {
    href,
    lessonId,
  }
}

export const CuryteLink = Node.create({
  name: 'curyteLink',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      inline: false,
    }
  },

  addAttributes() {
    return {
      href: { default: null },
      lessonId: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'a[data-curyte-link]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      { class: 'px-2 w-full h-fit', 'data-drag-handle': '' },
      [
        'a',
        mergeAttributes(
          { 'data-curyte-link': '' },
          this.options.HTMLAttributes,
          HTMLAttributes
        ),
        `${node.attrs.href}`,
      ],
    ]
  },

  renderText({ node }) {
    return node.attrs.href
  },

  addNodeView() {
    return ReactNodeViewRenderer(CuryteLinkRenderer)
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: tiptapFindLessonMatchRegex,
        type: this.type,
        getAttributes,
      }),
    ]
  },

  addCommands() {
    return {
      setCuryteLink:
        (options) =>
        ({ tr, dispatch }) => {
          const matches = Array.from(
            options.src.match(curyteLessonUrlMatchRegex)?.values() || []
          )
          if (!matches?.length) return false
          const { selection } = tr
          const attributes = getAttributes(matches)
          const node = this.type.create(attributes)

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node)
          }

          return true
        },
    }
  },

  addPasteRules() {
    return [
      {
        find: tiptapFindLessonMatchRegex,
        handler: ({
          state,
          range,
          match,
        }: {
          state: EditorState
          range: { from: number; to: number }
          match: string[]
        }) => {
          const attributes = getAttributes(match)
          const { tr } = state
          const start = range.from
          const end = range.to

          tr.replaceWith(start, end, this.type.create(attributes))
        },
      },
    ]
  },
})
