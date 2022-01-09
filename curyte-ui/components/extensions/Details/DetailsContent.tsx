import { Node } from '@tiptap/core'

export default Node.create({
  name: 'detailsContent',
  content: 'block*',
  selectable: false,

  parseHTML() {
    return [
      {
        tag: '*',
        consuming: false,
        context: 'details/',
        priority: 100,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem('detailsContent'),
      'Shift-Tab': () => this.editor.commands.liftListItem('detailsContent'),
    }
  },
})
