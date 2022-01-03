import { Node, Command, nodeInputRule, mergeAttributes } from '@tiptap/core'
import assert from 'assert'
import { vimeoUrlMatchRegex } from './matchers'

declare module '@tiptap/core' {
  interface Commands {
    vimeo: {
      setVimeoVideo: (options: { src: string }) => Command
    }
  }
}

const VimeoEmbed = Node.create({
  name: 'vimeo',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      inline: false,
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper w-full h-full shadow-lg rounded-xl min-h-96',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      id: {
        default: null,
      },
      controls: {
        default: true,
      },
      type: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'vimeo',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    assert(HTMLAttributes.src)
    const src = `https://player.vimeo.com/video/${
      HTMLAttributes.src.match(vimeoUrlMatchRegex)[4]
    }?byline=0`
    return [
      'div',
      { class: 'my-8 lg:max-w-[50vw] mx-auto' },
      [
        'div',
        {
          class: 'px-2 w-full h-auto relative aspect-w-16 aspect-h-9',
          'data-drag-handle': '',
        },
        [
          'iframe',
          {
            ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            src,
          },
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setVimeoVideo:
        (options) =>
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

  addInputRules() {
    return [
      nodeInputRule({
        find: vimeoUrlMatchRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, src, id, type] = match

          return { src, id, type }
        },
      }),
    ]
  },
})
export default VimeoEmbed
