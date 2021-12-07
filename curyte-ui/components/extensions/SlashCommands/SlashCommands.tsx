/* eslint-disable @typescript-eslint/no-explicit-any */
import { Extension, Editor, Range } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

export default Extension.create({
  name: 'mention',

  defaultOptions: {
    suggestion: {
      char: '/',
      startOfLine: false,
      command: ({
        editor,
        range,
        props,
      }: {
        editor: Editor
        range: Range
        props: any
      }) => {
        props.command({ editor, range })
      },
    },
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
