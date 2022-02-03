import { nodeInputRule, Attribute } from '@tiptap/core'
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'
import Image from '@tiptap/extension-image'

import { uploadImagePlugin, UploadFn } from './UploadImage'
import { CuryteImageAttrs } from './CuryteImageAttrs'
import CuryteImageRenderer from './CuryteImageRenderer'

type ExtensionAttrs = { [key in keyof CuryteImageAttrs]: Partial<Attribute> }

/**
 * Tiptap Extension to upload images
 * @see  https://gist.github.com/slava-vishnyakov/16076dff1a77ddaca93c4bccd4ec4521#gistcomment-3744392
 * @since 7th July 2021
 *
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */

const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

const CuryteImage = (uploadFn: UploadFn) => {
  return Image.extend({
    name: 'image',
    addOptions() {
      return {
        inline: true,
        HTMLAttributes: {},
      }
    },

    inline() {
      return this.options.inline
    },

    group() {
      return this.options.inline ? 'inline' : 'block'
    },

    isolating: true,
    draggable: true,
    selectable: true,

    addAttributes() {
      return {
        src: {
          default: null,
        },
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
        caption: {
          default: null,
        },
        displayMode: {
          default: 'center',
        },
      } as ExtensionAttrs
    },

    parseHTML: () => [
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {}
          const element = dom as HTMLImageElement

          const obj = {
            src: element.getAttribute('src'),
            title: element.getAttribute('title'),
            alt: element.getAttribute('alt'),
            caption: element.getAttribute('caption'),
          }
          return obj
        },
      },
    ],

    renderHTML({ HTMLAttributes }) {
      return ['img', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
      return ReactNodeViewRenderer(CuryteImageRenderer)
    },

    addCommands() {
      return {
        setImage:
          (attrs) =>
          ({ state, dispatch }) => {
            const { selection } = state
            const position = selection.$head
              ? selection.$head.pos
              : selection.$to.pos

            const node = this.type.create(attrs)
            const transaction = state.tr.insert(position, node)
            return dispatch?.(transaction)
          },
      }
    },
    addInputRules() {
      return [
        nodeInputRule({
          find: IMAGE_INPUT_REGEX,
          type: this.type,
          getAttributes: (match) => {
            const [, alt, src, title] = match
            return {
              src,
              alt,
              title,
            }
          },
        }),
      ]
    },
    addProseMirrorPlugins() {
      return [uploadImagePlugin(uploadFn)]
    },
  })
}

export default CuryteImage
