// import { FloatMenuItem } from './FloatMenu'

// export const defaultFloatMenuItems: FloatMenuItem[] = [
//   {
//     name: 'Bold',
//     icon: <i className="text-gray-900 ri-lg ri-bold" />,
//     shortcut: 'Ctrl B',
//     active: (editor) => editor.isActive('bold'),
//     command: (editor) => editor.chain().toggleBold().focus().run(),
//     disable: (editor) => !editor.schema.marks.bold,
//   },
//   {
//     name: 'Italic',
//     icon: <i className="text-gray-900 ri-lg ri-italic" />,
//     shortcut: 'Ctrl I',
//     active: (editor) => editor.isActive('italic'),
//     command: (editor) => editor.chain().toggleItalic().focus().run(),
//     disable: (editor) => !editor.schema.marks.italic,
//   },
//   {
//     name: 'Link',
//     icon: <i className="text-gray-900 ri-lg ri-link" />,
//     shortcut: 'Ctrl K',
//     active: (editor) => editor.isActive('link'),
//     command: (editor) => {
//       editor
//         .chain()
//         .toggleLink({ href: '' })
//         .setTextSelection(editor.state.selection.to - 1)
//         .run()
//     },
//     disable: (editor) => !editor.schema.marks.link,
//   },
//   {
//     name: 'Code',
//     icon: <i className="text-gray-900 ri-lg ri-code-line" />,
//     shortcut: 'Ctrl E',
//     active: (editor) => editor.isActive('code'),
//     command: (editor) => editor.chain().toggleCode().focus().run(),
//     disable: (editor) => !editor.schema.marks.code,
//   },
//   {
//     name: 'Strikethrough',
//     icon: <i className="text-gray-900 ri-lg ri-strikethrough" />,
//     shortcut: 'Ctrl Shift X',
//     active: (editor) => editor.isActive('strike'),
//     command: (editor) => editor.chain().toggleStrike().focus().run(),
//     disable: (editor) => !editor.schema.marks.strike,
//   },
//   {
//     name: 'Highlight',
//     icon: <i className="text-gray-900 ri-lg ri-mark-pen-line" />,
//     shortcut: 'Ctrl Shift H',
//     active: (editor) => editor.isActive('highlight'),
//     command: (editor) => editor.chain().toggleHighlight().focus().run(),
//     disable: (editor) => !editor.schema.marks.highlight,
//   },
// ]

export {}
