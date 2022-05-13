import { Attribute, Node, wrappingInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NoticeAttrs } from './NoticeAttrs'
import NoticeRenderer from './NoticeRenderer'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    notice: {
      setNotice: () => ReturnType
      toggleNotice: () => ReturnType
    }
  }
}

type ExtensionAttrs = { [key in keyof NoticeAttrs]: Partial<Attribute> }

const Notice = Node.create({
  name: 'notice',
  content: 'block+',
  group: 'block',
  defining: true,
  atom: true,

  addAttributes() {
    return {
      backgroundColor: { default: 'transparent' },
    } as ExtensionAttrs
  },

  parseHTML() {
    return [{ tag: 'notice' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['notice', HTMLAttributes, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(NoticeRenderer)
  },

  addInputRules() {
    const inputRegex = /^\s*(<notice>)$/

    return [wrappingInputRule({ find: inputRegex, type: this.type })]
  },

  addCommands() {
    return {
      setNotice:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: 'notice',
            content: [
              {
                type: 'paragraph',
              },
            ],
          }),
      toggleNotice:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: 'notice',
            content: [
              {
                type: 'paragraph',
              },
            ],
          }),
    }
  },
})

export default Notice
