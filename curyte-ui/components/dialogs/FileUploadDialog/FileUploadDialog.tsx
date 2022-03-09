import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Input,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import UploadProgressBar from '../../UploadProgressBar'
import { useDropzone } from 'react-dropzone'
import { pdfUrlMatchRegex } from '../../embeds/matchers'
import { exception } from '../../../utils/gtag'

interface FileUploadDialogProps {
  title: string
  description?: string | React.ReactNode
  isOpen: boolean
  onClose: () => void
  onSuccess: (url: string) => void
  acceptType?: string | string[]
  dropzoneText?: string
}

const FileUploadDialog = ({
  title,
  description,
  isOpen,
  onClose,
  onSuccess,
  acceptType = '.pdf',
  dropzoneText = 'Drop a pdf here, or click to select a pdf',
}: FileUploadDialogProps) => {
  const ref = useRef(null)
  const [loading, setLoading] = useState(false)

  const onDropAccepted = async (files: File[]) => {
    setFile(files[0])
    setError('')
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: acceptType,
    onDropAccepted,
    disabled: loading,
  })

  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const [url, setUrl] = useState('')

  const localOnClose = () => {
    setFile(null)
    setUrl('')
    setError('')
    onClose()
  }

  const localOnSuccess = (src: string) => {
    onSuccess(src)
    localOnClose()
  }

  const handleUrlChange = async (input: string) => {
    setUrl(input)
    setError('')
    if (pdfUrlMatchRegex.test(input)) {
      setLoading(true)
      try {
        const blob = await fetch(input, { mode: 'cors' }).then((res) =>
          res.blob()
        )
        await onDropAccepted([new File([blob], input, { type: blob.type })])
      } catch (e) {
        exception(e as string)
        setError(
          e +
            '; Unable to fetch image from URL. Please save it and upload directly.'
        )
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={localOnClose}
      leastDestructiveRef={ref}
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            className="leading-tight tracking-tighter"
          >
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {description}
            <div className="flex flex-col items-center w-full">
              <Input
                disabled={loading}
                placeholder="Paste a URL to an image"
                isInvalid={!!(url && !pdfUrlMatchRegex.test(url))}
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              <div className="my-4 text-lg font-bold leading-tight tracking-tighter">
                OR
              </div>
              <div
                {...getRootProps({
                  className:
                    'dropzone w-full p-8 bg-zinc-50 rounded-xl border-dashed border border-zinc-200 cursor-pointer hover:bg-zinc-100',
                })}
              >
                <input {...getInputProps()} />
                <p className="font-semibold text-center text-zinc-500">
                  {dropzoneText}
                </p>
              </div>
              <div className="w-full mt-4">
                {error && (
                  <div className="flex flex-wrap text-lg font-semibold text-red-500 error">
                    {error}
                  </div>
                )}
                {file && (
                  <div className="truncate text-ellipsis">{file.name}</div>
                )}
                {file && (
                  <UploadProgressBar
                    file={file}
                    onSuccess={localOnSuccess}
                    onError={setError}
                    shouldCompress={false}
                  />
                )}
              </div>
            </div>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default FileUploadDialog
