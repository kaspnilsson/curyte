import { Editor } from '@tiptap/core'
import { InputDialogProps } from '../InputDialog'
import MenuItem from '../MenuItem'
import {
  googleDocsUrlMatchRegex,
  googleDrawingsUrlMatchRegex,
  googleDriveUrlMatchRegex,
  googleSheetsUrlMatchRegex,
  googleSlidesUrlMatchRegex,
  youtubeUrlMatchRegex,
} from '../embeds/matchers'
import useImageUploadDialog from '../../hooks/useImageUploadDialog'
import useFileUploadDialog from '../../hooks/useFileUploadDialog'
import { initialLessonContent } from '../LessonEditor'

interface Props {
  editor: Editor
  openDialog: (input: Partial<InputDialogProps>) => void
  forceInsertAtEnd?: boolean
  forceNewBlock?: boolean
}

const InsertMenuItems = ({
  editor,
  openDialog,
  forceInsertAtEnd = false,
  forceNewBlock = false,
}: Props) => {
  const { getImageSrc } = useImageUploadDialog()
  const { getFileSrc } = useFileUploadDialog()

  const maybeFocusAndAppendToEnd = () => {
    if (forceInsertAtEnd) {
      editor
        .chain()
        .focus('end', { scrollIntoView: true })
        .insertContent({ type: 'paragraph' })
        .run()
    }
  }

  // https://stackoverflow.com/questions/68146588/tiptap-insert-node-below-at-the-end-of-the-current-one
  const maybeForceNewBlock = () => {
    if (forceNewBlock) {
      const pos = editor.state.selection.$from.after(1)
      editor.commands.focus('start')
      editor.chain().insertContentAt(pos, { type: 'paragraph' }).run()
    }
  }

  return (
    <>
      <MenuItem
        onClick={() => {
          maybeFocusAndAppendToEnd()
          maybeForceNewBlock()
          editor.chain().insertContent(initialLessonContent).run()
        }}
        icon={<i className="font-thin ri-2x ri-input-method-line" />}
        label="Section"
        description="Add a new section."
      />
      <MenuItem
        onClick={() => {
          maybeFocusAndAppendToEnd()
          maybeForceNewBlock()
          editor.commands.toggleNotice()
        }}
        icon={<i className="font-thin ri-2x ri-lightbulb-line" />}
        label="Prompt"
        description="Insert a separate block for emphasis."
      />
      <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
            title: 'Enter a video URL',
            description: 'Paste a link from either Youtube or Vimeo.',
            onConfirm: (src: string) => {
              if (youtubeUrlMatchRegex.test(src)) {
                maybeFocusAndAppendToEnd()
                maybeForceNewBlock()
                editor.commands.setYoutubeVideo({
                  src,
                })
              } else {
                maybeFocusAndAppendToEnd()
                maybeForceNewBlock()
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
        icon={<i className="font-thin ri-2x ri-movie-line" />}
        label="Video (Youtube or Vimeo)"
        description="Embed any video from Youtube or Vimeo."
      />
      <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
            title: 'Enter a URL',
            description: (
              <span>
                Enter the URL for a Google Drive page. Please ensure whatever
                you are linking has been shared publicly! For more, view
                <a
                  className="ml-1 text-zinc-700 hover:text-zinc-900 visited:text-zinc-500"
                  href="https://support.google.com/a/users/answer/9308873?hl=en"
                  target="_blank"
                  rel="noreferrer"
                >
                  the documentation from Google.
                </a>
              </span>
            ),
            onConfirm: (src: string) => {
              maybeFocusAndAppendToEnd()
              maybeForceNewBlock()
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
        icon={<i className="font-thin ri-2x ri-drive-line" />}
        label="Google Doc"
        description="Embed a Google Doc."
      />
      <MenuItem
        onClick={async () => {
          const src = await getImageSrc({
            title: 'Upload an image',
          })
          if (src) {
            maybeFocusAndAppendToEnd()
            maybeForceNewBlock()
            editor.chain().focus().setImage({ src }).run()
          }
        }}
        icon={<i className="font-thin ri-2x ri-image-line" />}
        label="Image"
        description="Embed an image, either uploaded or from another site."
      />
      <MenuItem
        onClick={async () => {
          const src = await getFileSrc({
            title: 'Upload a PDF',
          })
          if (src) {
            maybeFocusAndAppendToEnd()
            maybeForceNewBlock()
            editor.chain().focus().setIFrame({ src }).run()
          }
        }}
        icon={<i className="font-thin ri-2x ri-file-pdf-line" />}
        label="PDF"
        description="Embed a PDF, either uploaded or from another site."
      />
      <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
            title: 'Enter a URL',
            description: 'Enter the URL for another website.',
            onConfirm: (src: string) => {
              maybeFocusAndAppendToEnd()
              maybeForceNewBlock()
              editor.chain().focus().setIFrame({ src }).run()
            },
          })
        }}
        icon={<i className="font-thin ri-2x ri-window-line" />}
        label="Webpage"
        description="Embed any webpage on the internet."
      />
      <MenuItem
        onClick={() => {
          maybeFocusAndAppendToEnd()
          maybeForceNewBlock()
          editor.chain().focus().toggleCodeBlock().run()
        }}
        icon={<i className="font-thin ri-2x ri-code-box-line" />}
        label="Code block"
        description="Insert a code block."
      />
      <MenuItem
        onClick={() => {
          maybeFocusAndAppendToEnd()
          maybeForceNewBlock()
          editor.commands.addMultipleChoice()
        }}
        icon={<i className="font-thin ri-2x ri-survey-line" />}
        label="Quiz question"
        description="Insert a multiple choice question."
      />
      <MenuItem
        onClick={() => {
          maybeFocusAndAppendToEnd()
          maybeForceNewBlock()
          editor.commands.toggleDetails()
        }}
        icon={<i className="font-thin ri-2x ri-split-cells-vertical" />}
        label="Collapsible section"
        description="Insert a collapsible section."
      />
      <MenuItem
        onClick={() => {
          maybeFocusAndAppendToEnd()
          maybeForceNewBlock()
          editor
            .chain()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }}
        icon={<i className="font-thin ri-2x ri-grid-line" />}
        label="Table"
        description="Insert a table."
      />
      <MenuItem
        description="Create a simple bulleted list."
        label="Bulleted list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<i className="font-thin ri-2x ri-list-unordered" />}
      />
      <MenuItem
        description="Create a list with sequential numbering."
        label="Numbered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<i className="font-thin ri-2x ri-list-ordered" />}
      />
      <MenuItem
        description="Capture a quote."
        label="Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={<i className="font-thin ri-2x ri-double-quotes-l" />}
      />
      <MenuItem
        description="Visually divide sections."
        label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<i className="font-thin ri-2x ri-separator" />}
      />
      {/* <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
            title: 'Enter a lesson URL',
            description: 'Enter the URL for a Curyte lesson.',
            onConfirm: (src: string) => {
              maybeFocusAndAppendToEnd()
              maybeForceNewBlock()
              editor.commands.setCuryteLink({ src })
            },
            initialValue: '',
            validator: (input: string) => {
              return curyteLessonUrlMatchRegex.test(input)
            },
          })
        }}
        icon={<CuryteLogo width="32px" height="32px" />}
        label="Curyte Lesson"
        description="Embed a Curyte lesson."
      /> */}
    </>
  )
}

export default InsertMenuItems
