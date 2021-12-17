import { mergeAttributes, Command, Attribute, Node } from '@tiptap/core'

import { ReactNodeViewRenderer } from '@tiptap/react'
import { MultipleChoiceAttrs, Option } from './MultipleChoiceAttrs'

declare module '@tiptap/core' {
  interface Commands {
    multipleChoice: {
      addMultipleChoice: (attrs: MultipleChoiceAttrs) => Command
    }
  }
}

type ExtensionAttrs = { [key in keyof MultipleChoiceAttrs]: Partial<Attribute> }

export const MultipleChoice = Node.create({
  name: 'multipleChoice',
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
      options: { default: [{} as Option] },
      correctAnswer: { default: 0 },
    } as ExtensionAttrs
  },

  renderHTML({ HTMLAttributes }) {
    return ['multiple-choice', mergeAttributes(HTMLAttributes), 0]
  },

  renderText({ node }) {
    return node.attrs.href
  },

  addNodeView() {
    return ReactNodeViewRenderer(null)
  },

  addCommands() {
    return {
      addMultipleChoice:
        (attrs: MultipleChoiceAttrs) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = this.type.create(attrs)

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node)
          }

          return true
        },
    }
  },
})
