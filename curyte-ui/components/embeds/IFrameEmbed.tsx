import { Node } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/react'

export interface IFrameOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: unknown
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIFrame: (options: { src: string }) => ReturnType
    }
  }
}

export const IFrameEmbed = Node.create({
  name: 'iframe',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class:
          'iframe-wrapper w-fit h-96 my-8 mx-1 shadow-lg w-full rounded-xl',
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
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => {
          return {
            allowfullscreen: this.options.allowFullscreen,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'px-2 w-full h-fit', 'data-drag-handle': '' },
      ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
    ]
  },

  addCommands() {
    return {
      setIFrame:
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
