import { EditorContent, FloatingMenu, Editor } from '@tiptap/react'
import React, { useState } from 'react'
import FancyEditorMenuBar from './FancyEditorMenuBar'
import TextBubbleMenu from './extensions/BubbleMenu/TextBubbleMenu'
import TableBubbleMenu from './extensions/BubbleMenu/TableBubbleMenu'
import DeleteButton from './popovers/DeleteButton'
import AddButton from './popovers/AddButton'
import StyleMenuItems from './menuItems/StyleMenuItems'
import InsertMenuItems from './menuItems/InsertMenuItems'
import InputDialog, { InputDialogProps } from './InputDialog'
import { Heading, MenuDivider } from '@chakra-ui/react'

interface Props {
  editor: Editor | null
  readOnly?: boolean
}

const FancyEditor = ({ editor, readOnly }: Props) => {
  const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  const onClose = () => {
    setDialogProps({ ...dialogProps, isOpen: false })
  }

  const openDialog = (input: Partial<InputDialogProps>) => {
    setDialogProps({ ...dialogProps, ...input, onClose })
  }
  return (
    <>
      <InputDialog {...dialogProps} />
      <div className="flex flex-col min-w-full max-w-full">
        {!readOnly && <FancyEditorMenuBar editor={editor} />}
        <EditorContent className="markdown-body" editor={editor} />
        {editor && (
          <>
            {!readOnly && (
              <>
                <TableBubbleMenu editor={editor} />
                <TextBubbleMenu editor={editor} />
                <FloatingMenu editor={editor} tippyOptions={{ zIndex: 12 }}>
                  <div
                    style={{ position: 'absolute', top: -16, left: -90 }}
                    className="flex gap-1 items-center"
                  >
                    <DeleteButton
                      disabled={editor.isEmpty}
                      onClick={() => {
                        editor.commands.selectParentNode()
                        editor.commands.deleteSelection()
                      }}
                    />
                    <AddButton
                      onClick={() => {
                        console.error('not done')
                      }}
                      items={
                        <>
                          <Heading
                            fontSize="xs"
                            className="text-gray-500 px-4 pt-2 tracking-tight md:tracking-tighter leading-tight"
                          >
                            STYLE
                          </Heading>
                          <StyleMenuItems editor={editor} />
                          <MenuDivider />
                          <Heading
                            fontSize="xs"
                            className="text-gray-500 px-4 pt-2 tracking-tight md:tracking-tighter leading-tight"
                          >
                            INSERT
                          </Heading>
                          <InsertMenuItems
                            editor={editor}
                            openDialog={openDialog}
                          />
                        </>
                      }
                    />
                  </div>
                </FloatingMenu>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default FancyEditor
