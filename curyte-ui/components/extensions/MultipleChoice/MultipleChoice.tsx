import { mergeAttributes, Command, Attribute, Node } from '@tiptap/core'

import { ReactNodeViewRenderer } from '@tiptap/react'
import { MultipleChoiceAttrs, Option } from './MultipleChoiceAttrs'
import MultipleChoiceRenderer from './MultipleChoiceRenderer'

declare module '@tiptap/core' {
  interface Commands {
    multipleChoice: {
      addMultipleChoice: (attrs?: MultipleChoiceAttrs) => Command
    }
  }
}

type ExtensionAttrs = { [key in keyof MultipleChoiceAttrs]: Partial<Attribute> }

export const MultipleChoice = Node.create({
  name: 'multipleChoice',
  group: 'block',
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      inline: false,
    }
  },

  addAttributes() {
    return {
      question: { default: '' },
      options: {
        default: [{} as Option, {} as Option],
        renderHTML: (attrs) => ({
          'data-options': JSON.stringify(attrs.options),
        }),
        parseHTML: (el) =>
          el.getAttribute('data-options')
            ? JSON.parse(el.getAttribute('data-options') || '')
            : null,
      },
      correctAnswer: { default: 1 },
    } as ExtensionAttrs
  },

  renderHTML({ HTMLAttributes }) {
    return ['multiple-choice', mergeAttributes(HTMLAttributes)]
  },

  parseHTML() {
    return [
      {
        tag: 'multiple-choice',
      },
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MultipleChoiceRenderer)
  },

  addCommands() {
    return {
      addMultipleChoice:
        (attrs?: MultipleChoiceAttrs) =>
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
