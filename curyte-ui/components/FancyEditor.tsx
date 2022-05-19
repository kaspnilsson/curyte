import { EditorContent, Editor } from '@tiptap/react'
import React from 'react'
import FancyEditorMenuBar from './FancyEditorMenuBar'
import TextBubbleMenu from './extensions/BubbleMenu/TextBubbleMenu'
import TableBubbleMenu from './extensions/BubbleMenu/TableBubbleMenu'
import classNames from 'classnames'
import LessonContentBubbleMenu from './extensions/BubbleMenu/LessonContentBubbleMenu'

interface Props {
  editor: Editor | null
  readOnly?: boolean
  presentMode?: boolean
}

const FancyEditor = ({
  editor,
  readOnly = false,
  presentMode = false,
}: Props) => {
  // const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  // const onClose = () => {
  //   setDialogProps({ ...dialogProps, isOpen: false })
  // }

  // const openDialog = (input: Partial<InputDialogProps>) => {
  //   setDialogProps({ ...dialogProps, ...input, onClose })
  // }
  return (
    <>
      {/* <InputDialog {...dialogProps} /> */}
      <div className="relative flex flex-col items-start w-full">
        {!readOnly && <FancyEditorMenuBar editor={editor} />}
        <EditorContent
          className={classNames(
            'prose prose-zinc prose-violet prose-headings:!font-semibold prose-headings:!tracking-tighter prose-headings:!leading-tight prose-headings:!scroll-m-28 prose-th:!px-2 prose-th:!py-4 prose-td:!px-2 prose-td:!py-4 prose-th:border prose-td:border prose-th:font-semibold prose-th:bg-zinc-100 md:overflow-hidden w-full max-w-full prose-strong:!text-inherit prose-headings:!text-inherit prose-a:!text-inherit prose-table:!text-inherit prose-blockquote:!text-inherit ',
            {
              'sm:prose-sm lg:prose-md xl:prose-lg': !presentMode,
              'sm:prose-sm md:prose-md lg:prose-lg xl:prose-xl': presentMode,
              'px-6 md:px-8': !readOnly,
            }
          )}
          spellCheck
          editor={editor}
        />
        {editor && (
          <>
            {readOnly && <LessonContentBubbleMenu editor={editor} />}
            {!readOnly && (
              <>
                <TableBubbleMenu editor={editor} />
                <TextBubbleMenu editor={editor} />
                {/* <FloatingMenu
                  editor={editor}
                  tippyOptions={{ zIndex: 11, animation: true }}
                  shouldShow={({ view }) => {
                    return (
                      view.endOfTextblock('forward') &&
                      view.endOfTextblock('backward')
                    )
                  }}
                >
                  <div
                    style={{ position: 'absolute', top: -16, left: -82 }}
                    className="hidden md:flex items-center bg-white border !rounded-lg shadow-xl"
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
                          <span className="px-4 pt-2 text-sm font-bold leading-tight tracking-tighter text-zinc-700">
                            INSERT
                          </span>
                          <InsertMenuItems
                            editor={editor}
                            openDialog={openDialog}
                          />
                          <MenuDivider />
                          <span className="px-4 pt-2 text-sm font-bold leading-tight tracking-tighter text-zinc-700">
                            STYLE
                          </span>
                          <StyleMenuItems editor={editor} />
                        </>
                      }
                    />
                  </div>
                </FloatingMenu> */}
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default FancyEditor
