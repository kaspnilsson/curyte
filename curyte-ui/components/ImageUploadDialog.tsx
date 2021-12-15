import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  InputGroup,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import UploadProgressBar from './UploadProgressBar'
// import Resizer from 'react-image-file-resizer'
import Compress from 'browser-image-compression'

export interface ImageUploadDialogProps {
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

// const resizeFile = (file: File): Promise<File> =>
//   new Promise((resolve) => {
//     Resizer.imageFileResizer(
//       file,
//       1500,
//       750,
//       'WEBP',
//       100,
//       0,
//       (uri) => {
//         resolve(uri as File)
//       },
//       'file'
//     )
//   })

const ImageUploadDialog = ({
  title,
  description,
  isOpen,
  onClose,
  onSuccess,
}: ImageUploadDialogProps) => {
  const ref = useRef(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.item(0)

    if (selected) {
      Compress(selected, compressOptions)
        .then((compressedBlob) => {
          const convertedBlobFile = new File([compressedBlob], selected.name, {
            type: selected.type,
            lastModified: Date.now(),
          })

          setFile(convertedBlobFile)
          setError('')
        })
        .catch((e) => {
          console.error(e)
        })
    } else {
      setFile(null)
      setError('Please select an image file (png or jpg)')
    }
  }

  const localOnClose = () => {
    setFile(null)
    setError('')
    onClose()
  }

  const localOnSuccess = (src: string) => {
    onSuccess(src)
    localOnClose()
  }

  const onClick = () => inputRef.current?.click()

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
            <InputGroup
              onClick={onClick}
              colorScheme="purple"
              variant="solid"
              className="flex items-center justify-center"
            >
              <input
                className="mt-4"
                type="file"
                hidden
                ref={inputRef}
                accept="image/*"
                placeholder="Enter a value..."
                onChange={onChange}
              />
              <Button leftIcon={<i className="ri-file-upload-line"></i>}>
                Choose a file...
              </Button>
            </InputGroup>
            <div className="mt-4">
              {error && <div className="error">{error}</div>}
              {file && <div>{file.name}</div>}
              {file && (
                <UploadProgressBar
                  file={file}
                  onSuccess={localOnSuccess}
                  onError={setError}
                />
              )}
            </div>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default ImageUploadDialog
