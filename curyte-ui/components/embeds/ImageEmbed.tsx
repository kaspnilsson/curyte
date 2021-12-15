import { Node } from '@tiptap/core'
import { mergeAttributes, nodeInputRule } from '@tiptap/react'
import { imageUrlMatchRegex } from './matchers'

export interface ImageOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: unknown
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { src: string }) => ReturnType
    }
  }
}

export const ImageEmbed = Node.create({
  name: 'image',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      allowFullScreen: true,
      HTMLAttributes: {
        class:
          'image-wrapper w-full w-fit-content h-auto my-8 rounded-xl shadow-lg',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'image',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'px-2 w-full h-fit', 'data-drag-handle': '' },
      ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
    ]
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: imageUrlMatchRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, src, id, type] = match

          return { src, id, type }
        },
      }),
    ]
  },

  addCommands() {
    return {
      setImage:
        (options: { src: string }) =>
        ({ tr, dispatch }) => {
          const { selection } = tr
          const node = this.type.create(options)

          if (dispatch) {
            tr.replaceRangeWith(selection.from, selection.to, node)
          }

          return true
        },
    }
  },
})
