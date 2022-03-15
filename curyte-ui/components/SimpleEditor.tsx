import { EditorContent, Editor } from '@tiptap/react'
import React from 'react'
import classNames from 'classnames'
import SimpleEditorMenuBar from './SimpleEditorMenuBar'

interface Props {
  editor: Editor | null
  readOnly?: boolean
  presentMode?: boolean
}

const SimpleEditor = ({
  editor,
  readOnly = false,
  presentMode = false,
}: Props) => {
  //   const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  //   const onClose = () => {
  //     setDialogProps({ ...dialogProps, isOpen: false })
  //   }

  //   const openDialog = (input: Partial<InputDialogProps>) => {
  //     setDialogProps({ ...dialogProps, ...input, onClose })
  //   }

  return (
    <>
      {/* <InputDialog {...dialogProps} /> */}
      <div className="relative flex flex-col items-start w-full">
        {!readOnly && <SimpleEditorMenuBar editor={editor} />}
        <EditorContent
          className={classNames(
            'px-3 pb-3 prose prose-zinc prose-violet prose-headings:!font-semibold prose-headings:!tracking-tighter prose-headings:!leading-tight prose-headings:!scroll-m-28 prose-th:!px-2 prose-th:!py-4 prose-td:!px-2 prose-td:!py-4 prose-th:border prose-td:border prose-th:font-semibold prose-th:bg-zinc-100 md:overflow-hidden w-full max-w-full',
            {
              'sm:prose-sm lg:prose-md': !presentMode,
              'sm:prose-sm md:prose-md': presentMode,
            }
          )}
          spellCheck
          editor={editor}
        />
      </div>
    </>
  )
}

export default SimpleEditor
