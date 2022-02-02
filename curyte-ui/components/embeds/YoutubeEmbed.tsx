import { Node, Command, nodeInputRule, mergeAttributes } from '@tiptap/core'
import assert from 'assert'
import { youtubeUrlMatchRegex } from './matchers'

declare module '@tiptap/core' {
  interface Commands {
    youtube: {
      setYoutubeVideo: (options: { src: string }) => Command
    }
  }
}

export const YoutubeEmbed = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      inline: false,
      allowFullscreen: true,
      HTMLAttributes: {
        class:
          'iframe-wrapper w-full h-full shadow-lg rounded-xl min-h-96 border',
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
        tag: 'youtube',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    assert(HTMLAttributes.src)
    const src = `https://www.youtube.com/embed/${
      HTMLAttributes.src.match(youtubeUrlMatchRegex)[1]
    }?modestbranding=1`

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
      setYoutubeVideo:
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
        find: youtubeUrlMatchRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, src, id, type] = match

          return { src, id, type }
        },
      }),
    ]
  },
})
