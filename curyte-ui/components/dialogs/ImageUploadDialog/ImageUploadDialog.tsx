import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
import React, { FormEvent, useRef, useState } from 'react'
import UploadProgressBar from '../../UploadProgressBar'
import { useDropzone } from 'react-dropzone'
import { imageUrlMatchRegex } from '../../embeds/matchers'
import { exception } from '../../../utils/gtag'
import { compressImage } from '../../../utils/upload-image'
import { searchImages, trackUnsplashDownload } from '../../../lib/apiHelpers'
import { AttributedPhoto } from '../../../interfaces/attributed_photo'
import { SearchIcon } from '@heroicons/react/outline'

interface ImageUploadDialogProps {
  title: string
  description?: string | React.ReactNode
  isOpen: boolean
  onClose: () => void
  onSuccess: (url: string) => void
}

const ImageUploadDialog = ({
  title,
  description,
  isOpen,
  onClose,
  onSuccess,
}: ImageUploadDialogProps) => {
  const [query, setQuery] = useState('')
  const ref = useRef(null)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<AttributedPhoto[]>([])

  const onDropAccepted = async (files: File[]) => {
    const f = files[0]
    setFile(await compressImage(f))
    setError('')
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
    setQuery('')
    setSearchResults([])
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

  const onSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (!query) return
    setLoading(true)
    setSearchResults((await searchImages(query)) || [])
    setLoading(false)
  }

  const onPhotoClick = (a: AttributedPhoto) => {
    trackUnsplashDownload(a.downloadUrl)
    localOnSuccess(a.url)
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={localOnClose}
      leastDestructiveRef={ref}
      motionPreset="slideInBottom"
      size="4xl"
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
                    'dropzone w-full p-8 bg-zinc-50 rounded-xl border-dashed border border-zinc-200 cursor-pointer hover:bg-zinc-100',
                })}
              >
                <input {...getInputProps()} />
                <p className="font-semibold text-center text-zinc-500">
                  Drop a photo here, or click to select a file
                </p>
              </div>
              <div className="w-full">
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
                    shouldCompress
                  />
                )}
              </div>
              <Heading fontSize="lg" className="my-4">
                OR
              </Heading>
              <form onSubmit={onSearch} className="w-full">
                <InputGroup className="w-full">
                  <InputLeftElement>
                    <SearchIcon className="w-5 h-5 text-zinc-500" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search Unsplash for royalty free images"
                    variant="filled"
                    autoFocus
                    colorScheme="black"
                    value={query}
                    onSubmit={onSearch}
                    onChange={(e) => setQuery(e.currentTarget.value)}
                  />
                  <InputRightElement>
                    <Button
                      colorScheme="black"
                      className="mr-2"
                      size="sm"
                      type="submit"
                    >
                      Go
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </form>
              {searchResults && (
                <div className="grid gap-6 py-8 md:grid-cols-3">
                  {searchResults.map((res, index) => (
                    <div key={index} className="flex flex-col gap-2 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={res.smallUrl}
                        alt={res.alt}
                        className="rounded-xl shadow cursor-pointer hover:opacity-60 aspect-[16/9] object-cover"
                        onClick={() => onPhotoClick(res)}
                      />
                      <span className="text-sm text-zinc-500">
                        by{' '}
                        <a
                          href={res.unsplashUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-violet-500"
                        >
                          {res.owner}
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default ImageUploadDialog
