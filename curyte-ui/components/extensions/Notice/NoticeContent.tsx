import { Node } from '@tiptap/core'

export default Node.create({
  name: 'noticeContent',
  content: 'block*',
  selectable: false,

  parseHTML() {
    return [
      {
        tag: '*',
        consuming: false,
        context: 'notice/',
        priority: 100,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem('noticeContent'),
      'Shift-Tab': () => this.editor.commands.liftListItem('noticeContent'),
    }
  },
})
