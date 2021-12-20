import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Heading,
  Input,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import UploadProgressBar from '../../UploadProgressBar'
import { useDropzone } from 'react-dropzone'
import Compress from 'browser-image-compression'
import { imageUrlMatchRegex } from '../../embeds/matchers'

interface ImageUploadDialogProps {
  title: string
  description?: string | React.ReactNode
  isOpen: boolean
  onClose: () => void
  onSuccess: (url: string) => void
}

const compressOptions = {
  // As the key specify the maximum size
  // Leave blank for infinity
  maxSizeMB: 1.5,
  // Use webworker for faster compression with
  // the help of threads
  useWebWorker: true,
}

const ImageUploadDialog = ({
  title,
  description,
  isOpen,
  onClose,
  onSuccess,
}: ImageUploadDialogProps) => {
  const ref = useRef(null)
  const [loading, setLoading] = useState(false)

  const onDropAccepted = async (files: File[]) => {
    const f = files[0]
    if (f.type === 'image/gif') {
      // Compress library does not support gif
      setFile(f)
    } else {
      Compress(f, compressOptions)
        .then((compressedBlob) => {
          const convertedBlobFile = new File([compressedBlob], f.name, {
            type: f.type,
            lastModified: Date.now(),
          })

          setFile(convertedBlobFile)
          setError('')
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: 'image/*',
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
    if (imageUrlMatchRegex.test(input)) {
      setLoading(true)
      try {
        const blob = await fetch(input, { mode: 'cors' }).then((res) =>
          res.blob()
        )
        await onDropAccepted([new File([blob], input, { type: blob.type })])
      } catch (e) {
        console.error(e)
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
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            {description}
            <div className="flex flex-col w-full items-center">
              <Input
                disabled={loading}
                placeholder="Paste a URL to an image"
                isInvalid={!!(url && !imageUrlMatchRegex.test(url))}
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              <Heading fontSize="lg" className="my-4">
                OR
              </Heading>
              <div
                {...getRootProps({
                  className:
                    'dropzone w-full p-8 bg-gray-50 rounded-xl border-dashed border-2 border-gray-300 cursor-pointer hover:bg-gray-100',
                })}
              >
                <input {...getInputProps()} />
                <p className="text-gray-500 text-center font-semibold">
                  Drop a photo here, or click to select a file
                </p>
              </div>
              <div className="mt-4 w-full">
                {error && (
                  <div className="error text-red-500 font-semibold text-lg flex flex-wrap">
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

export default ImageUploadDialog
