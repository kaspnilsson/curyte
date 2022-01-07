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
    imageFromAnotherSite: {
      /**
       * Add an image
       */
      setImage: (options: { src: string }) => ReturnType
      /**
       * Add an image
       */
      setImageByFile: (options: { img: File }) => ReturnType
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
        class: 'image-wrapper w-auto h-full min-h-96 shadow-lg rounded-xl',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: { default: '' },
      height: { default: '' },
      caption: { default: '' },
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
      { class: 'my-8 lg:max-w-[50vw] mx-auto' },
      [
        'div',
        {
          class: 'px-2 w-full h-auto relative not-prose flex justify-center',
          'data-drag-handle': '',
        },
        ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
      ],
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
