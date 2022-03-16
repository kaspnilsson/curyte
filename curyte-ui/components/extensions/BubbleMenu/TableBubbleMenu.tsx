import React from 'react'
import { BubbleMenu, Editor } from '@tiptap/react'
import MenuIconButton from '../../MenuIconButton'
import 'tippy.js/dist/svg-arrow.css'

interface Props {
  editor: Editor
}

const TableBubbleMenu = ({ editor }: Props) => {
  if (!editor) {
    return null
  }
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 200,
        animation: 'shift-away',
        zIndex: 1000,
      }}
      shouldShow={({ editor }) => editor.isActive('table')}
      className="relative flex gap-1 p-1 overflow-hidden bg-white rounded shadow"
    >
      <MenuIconButton
        label="Add column before"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        disabled={!editor.can().addColumnBefore()}
        icon={<i className="text-lg font-thin ri-insert-column-left" />}
      />
      <MenuIconButton
        label="Add column after"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
        icon={<i className="text-lg font-thin ri-insert-column-right" />}
      />
      <MenuIconButton
        label="Delete column"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        disabled={!editor.can().deleteColumn()}
        icon={<i className="text-lg font-thin ri-delete-column" />}
      />
      <MenuIconButton
        label="Add row before"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        disabled={!editor.can().addRowBefore()}
        icon={<i className="text-lg font-thin ri-insert-row-top" />}
      />
      <MenuIconButton
        label="Add row after"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
        icon={<i className="text-lg font-thin ri-insert-row-bottom" />}
      />
      <MenuIconButton
        label="Delete row"
        onClick={() => editor.chain().focus().deleteRow().run()}
        disabled={!editor.can().deleteRow()}
        icon={<i className="text-lg font-thin ri-delete-row" />}
      />
      <MenuIconButton
        label="Delete table"
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
        icon={<i className="text-lg font-thin ri-delete-bin-line" />}
      />
    </BubbleMenu>
  )
}

export default TableBubbleMenu
