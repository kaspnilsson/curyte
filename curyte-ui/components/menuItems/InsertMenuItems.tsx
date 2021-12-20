import { Editor } from '@tiptap/react'
import { InputDialogProps } from '../InputDialog'
import MenuItem from '../MenuItem'
import {
  curyteLessonUrlMatchRegex,
  googleDocsUrlMatchRegex,
  googleDrawingsUrlMatchRegex,
  googleDriveUrlMatchRegex,
  googleSheetsUrlMatchRegex,
  googleSlidesUrlMatchRegex,
  youtubeUrlMatchRegex,
} from '../embeds/matchers'
import CuryteLogo from '../CuryteLogo'
import useImageUploadDialog from '../../hooks/useImageUploadDialog'

interface Props {
  editor: Editor
  openDialog: (input: Partial<InputDialogProps>) => void
}
const InsertMenuItems = ({ editor, openDialog }: Props) => {
  const { getImageSrc } = useImageUploadDialog()

  return (
    <>
      <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
            title: 'Enter a lesson URL',
            description: 'Enter the URL for a Curyte lesson.',
            onConfirm: (src: string) => {
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
      />
      <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
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
            editor.chain().focus().setImage({ src }).run()
          }
        }}
        icon={<i className="ri-2x ri-image-line" />}
        label="Image from another site"
        description="Embed an image from another site."
      />
      <MenuItem
        onClick={() => {
          openDialog({
            isOpen: true,
            title: 'Enter a URL',
            description: 'Enter the URL for another website.',
            onConfirm: (src: string) => {
              editor.chain().focus().setIFrame({ src }).run()
            },
          })
        }}
        icon={<i className="ri-2x ri-window-line" />}
        label="Webpage"
        description="Embed any webpage or PDF on the internet."
      />
      <MenuItem
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        icon={<i className="ri-2x ri-code-box-line" />}
        label="Code block"
        description="Insert a code block."
      />
      <MenuItem
        onClick={() => editor.commands.addMultipleChoice()}
        icon={<i className="ri-2x ri-survey-line" />}
        label="Quiz question"
        description="Insert a multiple choice question."
      />
      <MenuItem
        onClick={() =>
          editor
            .chain()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        icon={<i className="ri-2x ri-grid-line" />}
        label="Table"
        description="Insert a table."
      />
    </>
  )
}

export default InsertMenuItems
