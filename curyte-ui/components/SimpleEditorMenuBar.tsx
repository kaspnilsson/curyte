import { Editor } from '@tiptap/react'
import { Center, Divider } from '@chakra-ui/react'
import React from 'react'
import MenuIconButton from './MenuIconButton'
import StyleMenuButton from './StyleMenuButton'

interface Props {
  editor: Editor | null
}

const SimpleEditorMenuBar = ({ editor }: Props) => {
  //   const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  //   const onClose = () => {
  //     setDialogProps({ ...dialogProps, isOpen: false })
  //   }

  //   const openDialog = (input: Partial<InputDialogProps>) => {
  //     setDialogProps({ ...dialogProps, ...input, onClose })
  //   }

  if (!editor) {
    return null
  }
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-center w-full gap-1 py-1 mb-4 bg-white border-t border-b border-zinc-200">
      {/* <InputDialog {...dialogProps} /> */}
      <MenuIconButton
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<i className="text-lg font-thin ri-bold" />}
      />
      <MenuIconButton
        label="Italicize"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<i className="text-lg font-thin ri-italic" />}
      />
      <Center className="w-4 h-6">
        <Divider
          orientation="vertical"
          className="opacity-100 border-zinc-200"
        />
      </Center>
      <StyleMenuButton editor={editor} />
      {/* <Menu id="insert-menu" isLazy boundary="scrollParent" colorScheme="zinc">
        <MenuButton size="sm" variant="ghost" colorScheme="zinc" as={Button}>
          <div className="flex items-center gap-1 text-sm text-zinc-900">
            Insert
            <i className="w-2 text-lg font-thin ri-arrow-drop-down-line"></i>
          </div>
        </MenuButton>
        <Portal>
          <MenuList className="z-20 overflow-auto max-h-96">
            <InsertMenuItems editor={editor} openDialog={openDialog} />
          </MenuList>
        </Portal>
      </Menu> */}
    </div>
  )
}
export default SimpleEditorMenuBar
