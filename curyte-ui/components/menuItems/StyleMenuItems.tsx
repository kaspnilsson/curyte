import { Editor } from '@tiptap/react'
import MenuItem from '../MenuItem'

interface Props {
  editor: Editor
}
const StyleMenuItems = ({ editor }: Props) => (
  <>
    <MenuItem
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      icon={<i className="font-thin ri-2x ri-h-1" />}
      label="Heading 1"
      description="Large section heading."
    />
    <MenuItem
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      icon={<i className="font-thin ri-2x ri-h-2" />}
      label="Heading 2"
      description="Medium section heading."
    />
    <MenuItem
      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      icon={<i className="font-thin ri-2x ri-h-3" />}
      label="Heading 3"
      description="Small section heading."
    />
    <MenuItem
      onClick={() => editor.chain().focus().toggleStrike().run()}
      icon={<i className="font-thin ri-2x ri-strikethrough" />}
      label="Strikethrough"
      isActive={editor.isActive('strike')}
      description="Crossed out text."
    />
    <MenuItem
      onClick={() => editor.chain().focus().toggleSuperscript().run()}
      icon={<i className="font-thin ri-2x ri-superscript" />}
      label="Superscript"
      isActive={editor.isActive('superscript')}
      description="Small superscripted text."
    />
    <MenuItem
      onClick={() => editor.chain().focus().toggleSubscript().run()}
      icon={<i className="font-thin ri-2x ri-subscript" />}
      label="Subscript"
      isActive={editor.isActive('subscript')}
      description="Small subscripted text."
    />
    <MenuItem
      onClick={() => editor.chain().focus().toggleHighlight().run()}
      icon={<i className="font-thin ri-2x ri-mark-pen-line" />}
      label="Highlight"
      isActive={editor.isActive('highlight')}
      description="Highlighted text."
    />
    {/* <MenuItem
      onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      icon={<i className="font-thin ri-2x ri-h-4" />}
      label="Heading 4"
      description="Very small section heading."
    /> */}
    {/* <MenuItem
      onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      icon={<i className="font-thin ri-2x ri-h-5" />}
      label="Heading 5"
      description="Heading 5"
    />
    <MenuItem
      onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      icon={<i className="font-thin ri-2x ri-h-6" />}
      label="Heading 6"
      description="Heading 6"
    /> */}
  </>
)

export default StyleMenuItems
