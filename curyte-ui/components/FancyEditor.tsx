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
      <div className="flex flex-col max-w-full min-w-full">
        {!readOnly && <FancyEditorMenuBar editor={editor} />}
        <EditorContent
          className="prose sm:prose-sm lg:prose-md xl:prose-lg max-w-none prose-zinc prose-headings:font-semibold prose-headings:tracking-tight prose-headings:leading-tight prose-headings:border-b-2 prose-headings:pb-2 prose-headings:scroll-m-28"
          spellCheck
          editor={editor}
        />
        {editor && (
          <>
            {!readOnly && (
              <>
                <TableBubbleMenu editor={editor} />
                <TextBubbleMenu editor={editor} />
                <FloatingMenu editor={editor} tippyOptions={{ zIndex: 12 }}>
                  <div
                    style={{ position: 'absolute', top: -16, left: -90 }}
                    className="flex items-center gap-1"
                  >
                    <DeleteButton
                      disabled={editor.isEmpty}
                      onClick={() => {
                        editor.commands.selectParentNode()
                        editor.commands.deleteSelection()
                      }}
                    />
                    <AddButton
                      items={
                        <>
                          <Heading
                            fontSize="xs"
                            className="px-4 pt-2 leading-tight tracking-tight text-zinc-500 md:tracking-tighter"
                          >
                            STYLE
                          </Heading>
                          <StyleMenuItems editor={editor} />
                          <MenuDivider />
                          <Heading
                            fontSize="xs"
                            className="px-4 pt-2 leading-tight tracking-tight text-zinc-500 md:tracking-tighter"
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
