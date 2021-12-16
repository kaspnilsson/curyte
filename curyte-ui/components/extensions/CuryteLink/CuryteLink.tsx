import { EditorState } from 'prosemirror-state'
import {
  Node,
  mergeAttributes,
  nodeInputRule,
  markPasteRule,
} from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import CuryteLinkRenderer from './CuryteLinkRenderer'

export const inputRegex = /https?:\/\/(www\.)?curyte.com\/lessons\/(.+)/g

const getAttributes = (match: string[]) => {
  const [href, , lessonId] = match
  return {
    href,
    lessonId,
  }
}

export const CuryteLink = Node.create({
  name: 'curyteLink',
  atom: true,
  priority: 100,
  group: 'block',
  selectable: true,
  marks: '',
  draggable: true,

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
      'a',
      mergeAttributes(
        { 'data-curyte-link': '' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      `${node.attrs.href}`,
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
        find: inputRegex,
        type: this.type,
        getAttributes,
      }),
    ]
  },

  addPasteRules() {
    return [markPasteRule({ find: inputRegex, type: this.type, getAttributes })]
  },
})