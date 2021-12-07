import { Editor } from '@tiptap/react'
import {
  Center,
  Divider,
  Menu,
  MenuList,
  MenuButton,
  Button,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import InputDialog, { InputDialogProps } from './InputDialog'
import {
  googleDocsUrlMatchRegex,
  googleDrawingsUrlMatchRegex,
  googleDriveUrlMatchRegex,
  googleSheetsUrlMatchRegex,
  googleSlidesUrlMatchRegex,
  imageUrlMatchRegex,
  youtubeUrlMatchRegex,
} from './embeds/matchers'
import MenuIconButton from './MenuIconButton'
import MenuItem from './MenuItem'

interface Props {
  editor: Editor | null
}

const FancyEditorMenuBar = ({ editor }: Props) => {
  const [dialogProps, setDialogProps] = useState({} as InputDialogProps)

  if (!editor) {
    return null
  }

  const onDialogClose = () => {
    setDialogProps({ ...dialogProps, isOpen: false })
  }

  return (
    <div className="flex flex-wrap border-b border-t border-gray-200 mb-8 py-2 items-center">
      <MenuIconButton
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        icon={<i className="text-gray-900 ri-lg ri-arrow-go-back-line" />}
      />
      <MenuIconButton
        label="Redo"
        disabled={editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        icon={<i className="text-gray-900 ri-lg ri-arrow-go-forward-line" />}
      />
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <Menu id="style-menu" isLazy colorScheme="purple">
        <MenuButton variant="ghost" colorScheme="purple" as={Button}>
          <div className="flex items-center text-gray-900 gap-1">
            Style
            <i className="ri-arrow-drop-down-line text-gray-900 ri-lg w-2"></i>
          </div>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            icon={<i className="text-gray-900 ri-lg ri-h-1" />}
            label={'Heading 1'}
          />
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            icon={<i className="text-gray-900 ri-lg ri-h-2" />}
            label="Heading 2"
          />
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            icon={<i className="text-gray-900 ri-lg ri-h-3" />}
            label="Heading 3"
          />
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            icon={<i className="text-gray-900 ri-lg ri-h-4" />}
            label="Heading 4"
          />
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            icon={<i className="text-gray-900 ri-lg ri-h-5" />}
            label="Heading 5"
          />
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            icon={<i className="text-gray-900 ri-lg ri-h-6" />}
            label="Heading 6"
          />
        </MenuList>
      </Menu>
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <MenuIconButton
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<i className="text-gray-900 ri-lg ri-bold" />}
      />
      <MenuIconButton
        label="Italicize"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<i className="text-gray-900 ri-lg ri-italic" />}
      />
      <MenuIconButton
        label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<i className="text-gray-900 ri-lg ri-strikethrough" />}
      />
      <MenuIconButton
        label="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('hightlight')}
        icon={<i className="text-gray-900 ri-lg ri-mark-pen-line" />}
      />
      <MenuIconButton
        label="Superscript"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive('superscript')}
        icon={<i className="text-gray-900 ri-lg ri-superscript" />}
      />
      <MenuIconButton
        label="Code (inline)"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={<i className="text-gray-900 ri-lg ri-code-line" />}
      />
      <MenuIconButton
        label="Clear formatting"
        onClick={() => {
          editor.chain().focus().unsetAllMarks().run()
          editor.chain().focus().clearNodes().run()
        }}
        icon={<i className="text-gray-900 ri-lg ri-format-clear" />}
      />
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <MenuIconButton
        label="Bulleted list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<i className="text-gray-900 ri-lg ri-list-unordered" />}
      />

      <MenuIconButton
        label="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<i className="text-gray-900 ri-lg ri-list-ordered" />}
      />
      <MenuIconButton
        label="To-do list"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        icon={<i className="text-gray-900 ri-lg ri-list-check-2" />}
      />
      <MenuIconButton
        label="Block quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={<i className="text-gray-900 ri-lg ri-double-quotes-l" />}
      />
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <MenuIconButton
        label="Add a line"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<i className="text-gray-900 ri-lg ri-separator" />}
      />
      <Menu id="insert-menu" isLazy colorScheme="purple">
        <MenuButton variant="ghost" colorScheme="purple" as={Button}>
          <div className="flex items-center text-gray-900 gap-1">
            Insert
            <i className="ri-arrow-drop-down-line text-gray-900 ri-lg w-2"></i>
          </div>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              setDialogProps({
                isOpen: true,
                onClose: onDialogClose,
                title: 'Enter a video URL',
                description: 'Paste a link from either Youtube or Vimeo.',
                onConfirm: (src: string) => {
                  if (youtubeUrlMatchRegex.test(src)) {
                    editor.commands.setYoutubeVideo({
                      src,
                    })
                  } else {
                    // It's vimeo
                    editor.commands.setVimeoVideo({
                      src,
                    })
                  }
                },
                initialValue: '',
                validator: (input: string) =>
                  youtubeUrlMatchRegex.test(input) ||
                  googleDrawingsUrlMatchRegex.test(input),
              })
            }}
            icon={<i className="text-gray-900 ri-lg ri-movie-line" />}
            label="Video (Youtube or Vimeo)"
          />
          <MenuItem
            onClick={() => {
              setDialogProps({
                isOpen: true,
                onClose: onDialogClose,
                title: 'Enter a URL',
                description: (
                  <span>
                    Enter the URL for a Google Drive page. Please ensure
                    whatever you are linking has been shared publicly! For more,
                    view
                    <a
                      className="ml-1 text-blue-600 hover:text-blue-800 visited:text-purple-600"
                      href="https://support.google.com/a/users/answer/9308873?hl=en"
                      target="_blank"
                      rel="noreferrer"
                    >
                      the documentation from Google.
                    </a>
                  </span>
                ),
                onConfirm: (src: string) => {
                  editor
                    .chain()
                    .focus()
                    .setGoogleDrive({
                      src: src
                        .replace('/edit', '/preview')
                        .replace('/pub', '/embed'),
                    })
                    .run()
                },
                initialValue: '',
                validator: (input: string) =>
                  googleDocsUrlMatchRegex.test(input) ||
                  googleDriveUrlMatchRegex.test(input) ||
                  googleSheetsUrlMatchRegex.test(input) ||
                  googleSlidesUrlMatchRegex.test(input) ||
                  googleDrawingsUrlMatchRegex.test(input),
              })
            }}
            icon={<i className="text-gray-900 ri-lg ri-drive-line" />}
            label="Google Doc"
          />
          <MenuItem
            onClick={() => {
              setDialogProps({
                isOpen: true,
                onClose: onDialogClose,
                title: 'Enter an image URL',
                description: 'Enter the URL to an image from another website.',
                onConfirm: (src: string) => {
                  editor.chain().focus().setImage({ src }).run()
                },
                initialValue: '',
                validator: (input: string) => imageUrlMatchRegex.test(input),
              })
            }}
            icon={<i className="text-gray-900 ri-lg ri-image-line" />}
            label="Image from another site"
          />
          <MenuItem
            onClick={() => {
              setDialogProps({
                isOpen: true,
                onClose: onDialogClose,
                title: 'Enter a URL',
                description: 'Enter the URL for another website.',
                onConfirm: (src: string) => {
                  editor.chain().focus().setIFrame({ src }).run()
                },
              })
            }}
            icon={<i className="text-gray-900 ri-lg ri-window-line" />}
            label="Webpage"
          />
          <MenuItem
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={<i className="text-gray-900 ri-lg ri-code-box-line" />}
            label="Code block"
          />
          <MenuItem
            onClick={() =>
              editor
                .chain()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            icon={<i className="text-gray-900 ri-lg ri-grid-line" />}
            label="Table"
          />
        </MenuList>
      </Menu>
      <InputDialog
        title={dialogProps.title}
        isOpen={dialogProps.isOpen}
        description={dialogProps.description}
        onClose={dialogProps.onClose}
        onConfirm={dialogProps.onConfirm}
        validator={dialogProps.validator}
        initialValue={dialogProps.initialValue}
      />
    </div>
  )
}
export default FancyEditorMenuBar
