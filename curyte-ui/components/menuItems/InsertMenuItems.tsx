import { Editor } from '@tiptap/react'
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
}
const InsertMenuItems = ({
  editor,
  openDialog,
  forceInsertAtEnd = false,
}: Props) => {
  const { getImageSrc } = useImageUploadDialog()
  const { getFileSrc } = useFileUploadDialog()

  return (
    <>
      <MenuItem
        onClick={() => {
          if (forceInsertAtEnd) {
            editor.commands.focus('end', { scrollIntoView: true })
          }
          editor.chain().insertContent(initialLessonContent).run()
        }}
        icon={<i className="ri-2x ri-input-method-line" />}
        label="Section"
        description="Add a new section."
      />
      <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
            title: 'Enter a video URL',
            description: 'Paste a link from either Youtube or Vimeo.',
            onConfirm: (src: string) => {
              if (youtubeUrlMatchRegex.test(src)) {
                if (forceInsertAtEnd) {
                  editor.commands.focus('end', { scrollIntoView: true })
                }
                editor.commands.setYoutubeVideo({
                  src,
                })
              } else {
                if (forceInsertAtEnd) {
                  editor.commands.focus('end', { scrollIntoView: true })
                }
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
        icon={<i className="ri-2x ri-movie-line" />}
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
              if (forceInsertAtEnd) {
                editor.commands.focus('end', { scrollIntoView: true })
              }
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
        icon={<i className="ri-2x ri-drive-line" />}
        label="Google Doc"
        description="Embed a Google Doc."
      />
      <MenuItem
        onClick={async () => {
          const src = await getImageSrc({
            title: 'Upload an image',
          })
          if (src) {
            if (forceInsertAtEnd) {
              editor.commands.focus('end', { scrollIntoView: true })
            }
            editor.chain().focus().setImage({ src }).run()
          }
        }}
        icon={<i className="ri-2x ri-image-line" />}
        label="Image"
        description="Embed an image, either uploaded or from another site."
      />
      <MenuItem
        onClick={async () => {
          const src = await getFileSrc({
            title: 'Upload a PDF',
          })
          if (src) {
            if (forceInsertAtEnd) {
              editor.commands.focus('end', { scrollIntoView: true })
            }
            editor.chain().focus().setIFrame({ src }).run()
          }
        }}
        icon={<i className="ri-2x ri-file-pdf-line" />}
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
              if (forceInsertAtEnd) {
                editor.commands.focus('end', { scrollIntoView: true })
              }
              editor.chain().focus().setIFrame({ src }).run()
            },
          })
        }}
        icon={<i className="ri-2x ri-window-line" />}
        label="Webpage"
        description="Embed any webpage on the internet."
      />
      <MenuItem
        onClick={() => {
          if (forceInsertAtEnd) {
            editor.commands.focus('end', { scrollIntoView: true })
          }
          editor.chain().focus().toggleCodeBlock().run()
        }}
        icon={<i className="ri-2x ri-code-box-line" />}
        label="Code block"
        description="Insert a code block."
      />
      <MenuItem
        onClick={() => {
          if (forceInsertAtEnd) {
            editor.commands.focus('end', { scrollIntoView: true })
          }
          editor.commands.addMultipleChoice()
        }}
        icon={<i className="ri-2x ri-survey-line" />}
        label="Quiz question"
        description="Insert a multiple choice question."
      />
      <MenuItem
        onClick={() => {
          if (forceInsertAtEnd) {
            editor.commands.focus('end', { scrollIntoView: true })
          }
          editor.commands.toggleDetails()
        }}
        icon={<i className="ri-2x ri-split-cells-vertical" />}
        label="Collapsible section"
        description="Insert a collapsible section."
      />
      <MenuItem
        onClick={() => {
          if (forceInsertAtEnd) {
            editor.commands.focus('end', { scrollIntoView: true })
          }
          editor
            .chain()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }}
        icon={<i className="ri-2x ri-grid-line" />}
        label="Table"
        description="Insert a table."
      />
      {/* <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
            title: 'Enter a lesson URL',
            description: 'Enter the URL for a Curyte lesson.',
            onConfirm: (src: string) => {
              if (forceInsertAtEnd) {
                editor.commands.focus('end', { scrollIntoView: true })
              }
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
