import { Node, mergeAttributes, Command } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import TOCComponent from './TOCComponent'

declare module '@tiptap/core' {
  interface Commands {
    tableOfContents: {
      addTableOfContents: () => Command
    }
  }
}

const TableOfContents = Node.create({
  name: 'tableOfContents',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'toc',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['toc', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TOCComponent)
  },

  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          id: {
            default: null,
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      addTableOfContents:
        () =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = this.type.create()

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node)
          }

          return true
        },
    }
  },
})

export default TableOfContents
