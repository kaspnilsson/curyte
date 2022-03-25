import { Attribute, Node, wrappingInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { DetailsAttrs } from './DetailsAttrs'
import DetailsRenderer from './DetailsRenderer'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    details: {
      setDetails: () => ReturnType
      toggleDetails: () => ReturnType
    }
  }
}

type ExtensionAttrs = { [key in keyof DetailsAttrs]: Partial<Attribute> }

const Details = Node.create({
  name: 'details',
  content: 'block+',
  group: 'block',
  defining: true,

  addAttributes() {
    return {
      isOpen: { default: true },
      summary: { default: '' },
    } as ExtensionAttrs
  },

  parseHTML() {
    return [{ tag: 'details' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['details', HTMLAttributes, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DetailsRenderer)
  },

  addInputRules() {
    const inputRegex = /^\s*(<details>)$/

    return [wrappingInputRule({ find: inputRegex, type: this.type })]
  },

  addCommands() {
    return {
      setDetails: () => (args) => args.commands.wrapInList('details'),
      toggleDetails:
        () =>
        ({ commands }) =>
          commands.wrapInList('details'),
    }
  },
})

export default Details
