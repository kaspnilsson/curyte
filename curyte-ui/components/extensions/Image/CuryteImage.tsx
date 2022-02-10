import { nodeInputRule } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/react'
import classNames from 'classnames'
import Image from '@tiptap/extension-image'

import { uploadImagePlugin, UploadFn } from './UploadImage'

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
        HTMLAttributes: {
          class: 'image-wrapper w-auto h-full min-h-96 shadow-lg rounded-xl',
        },
      }
    },

    inline() {
      return this.options.inline
    },

    group() {
      return this.options.inline ? 'inline' : 'block'
    },

    draggable: true,

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
      }
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
          }
          return obj
        },
      },
    ],

    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        { class: 'mx-auto' },
        [
          'div',
          {
            class: classNames(
              'm-8 h-auto relative not-prose flex justify-center',
              { 'opacity-50': HTMLAttributes.uploading }
            ),
            'data-drag-handle': '',
          },
          ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
        ],
      ]
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
