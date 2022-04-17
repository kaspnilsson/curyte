import { nodeInputRule, Attribute } from '@tiptap/core'
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'
import Image from '@tiptap/extension-image'

import { uploadImagePlugin, UploadFn } from './UploadImage'
import { CuryteImageAttrs } from './CuryteImageAttrs'
import CuryteImageRenderer from './CuryteImageRenderer'
import classNames from 'classnames'
import { NodeSelection } from 'prosemirror-state'

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
          default: '',
        },
        alt: {
          default: '',
        },
        title: {
          default: '',
        },
        caption: {
          default: '',
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
            caption: element.getAttribute('caption') || '',
            displayMode: element.getAttribute('displayMode') || 'center',
          }
          return obj
        },
      },
    ],

    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        { class: 'my-8 lg:max-w-[50vw] mx-auto px-4' },
        [
          'div',
          {
            class: classNames(
              'w-full h-auto relative not-prose flex justify-center',
              { 'opacity-50': HTMLAttributes.uploading }
            ),
            'data-drag-handle': '',
          },
          ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
        ],
      ]
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

    addKeyboardShortcuts() {
      return {
        Backspace: () => {
          const { $anchor, from, to } = this.editor.state.selection
          // If it is a large selection, don't handle the event.
          if (from !== to) return false
          if ($anchor.nodeBefore && $anchor.nodeBefore.type === this.type) {
            // select it.
            this.editor.view.dispatch(
              this.editor.state.tr.setSelection(
                NodeSelection.create(this.editor.state.doc, from - 1)
              )
            )

            return true
          }
          return false
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
