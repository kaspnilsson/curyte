import { Editor } from '@tiptap/react'
import {
  IconButton,
  Tooltip,
  Center,
  Divider,
  Menu,
  MenuList,
  MenuItem,
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
      <Tooltip hasArrow label="Undo">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          aria-label="undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <i className="text-gray-900 ri-lg ri-arrow-go-back-line" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Redo">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          aria-label="redo"
          disabled={editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <i className="text-gray-900 ri-lg ri-arrow-go-forward-line" />
        </IconButton>
      </Tooltip>
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <Menu id="style-menu" isLazy colorScheme="purple">
        <MenuButton
          variant="ghost"
          colorScheme="purple"
          aria-label="Options"
          as={Button}
        >
          <div className="flex items-center text-gray-900">
            Style
            <i className="ri-arrow-drop-down-line text-gray-900 ri-lg w-2"></i>
          </div>
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive('heading', { level: 1 })}
            aria-label="h1"
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-h-1" />
              Heading 1
            </div>
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive('heading', { level: 2 })}
            aria-label="h2"
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-h-2" />
              Heading 2
            </div>
          </MenuItem>
          <MenuItem
            aria-label="h3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive('heading', { level: 3 })}
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-h-3" />
              Heading 3
            </div>
          </MenuItem>
          <MenuItem
            aria-label="h4"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            isActive={editor.isActive('heading', { level: 4 })}
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-h-6" />
              Heading 4
            </div>
          </MenuItem>
          <MenuItem
            aria-label="h5"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            isActive={editor.isActive('heading', { level: 5 })}
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-h-5" />
              Heading 5
            </div>
          </MenuItem>
          <MenuItem
            aria-label="h6"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            isActive={editor.isActive('heading', { level: 6 })}
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-h-6" />
              Heading 6
            </div>
          </MenuItem>
        </MenuList>
      </Menu>
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <Tooltip hasArrow label="Bold">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          aria-label="bold"
        >
          <i className="text-gray-900 ri-lg ri-bold" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Italicize">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          aria-label="italic"
        >
          <i className="text-gray-900 ri-lg ri-italic" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Strikethrough">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          aria-label="strikethrough"
        >
          <i className="text-gray-900 ri-lg ri-strikethrough" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Superscript">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          aria-label="superscript"
        >
          <i className="text-gray-900 ri-lg ri-superscript" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Code (inline)">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          aria-label="code"
        >
          <i className="text-gray-900 ri-lg ri-code-line" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Clear formatting">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          onClick={() => {
            editor.chain().focus().unsetAllMarks().run()
            editor.chain().focus().clearNodes().run()
          }}
          aria-label="Clear formatting"
        >
          <i className="text-gray-900 ri-lg ri-format-clear" />
        </IconButton>
      </Tooltip>
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <Tooltip hasArrow label="Bulleted list">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          aria-label="bulleted list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <i className="text-gray-900 ri-lg ri-list-unordered" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Ordered list">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          aria-label="ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <i className="text-gray-900 ri-lg ri-list-ordered" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Code (block)">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          aria-label="code block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
        >
          <i className="text-gray-900 ri-lg ri-code-box-line" />
        </IconButton>
      </Tooltip>
      <Tooltip hasArrow label="Block quote">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          aria-label="blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        >
          <i className="text-gray-900 ri-lg ri-double-quotes-l" />
        </IconButton>
      </Tooltip>
      <Center className="h-6 w-4">
        <Divider
          orientation="vertical"
          className="border-gray-200 opacity-100"
        />
      </Center>
      <Tooltip hasArrow label="Add a line">
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="purple"
          aria-label="horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <i className="text-gray-900 ri-lg ri-separator" />
        </IconButton>
      </Tooltip>
      <Menu id="insert-menu" isLazy colorScheme="purple">
        <MenuButton variant="ghost" colorScheme="purple" as={Button}>
          <div className="flex items-center text-gray-900">
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
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-movie-line" />
              Video (Youtube or Vimeo)
            </div>
          </MenuItem>
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
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-drive-line" />
              Google Doc
            </div>
          </MenuItem>
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
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-image-line" />
              Image from another site
            </div>
          </MenuItem>
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
          >
            <div className="flex items-center gap-4">
              <i className="text-gray-900 ri-lg ri-window-line" />
              Webpage
            </div>
          </MenuItem>
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
