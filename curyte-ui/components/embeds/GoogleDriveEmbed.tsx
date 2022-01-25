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
    googledrive: {
      /**
       * Add a Google Doc / thing from GDrive
       */
      setGoogleDrive: (options: { src: string }) => ReturnType
    }
  }
}

export const GoogleDriveEmbed = Node.create({
  name: 'googledrive',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class:
          'googledrive-wrapper w-full h-full shadow-lg rounded-xl min-h-96',
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
        tag: 'googledrive',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'my-8 lg:max-w-[50vw] mx-auto' },
      [
        'div',
        {
          class: 'w-full h-auto relative aspect-w-16 aspect-h-9',
          'data-drag-handle': '',
        },
        [
          'iframe',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setGoogleDrive:
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
