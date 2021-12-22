import { Button } from '@chakra-ui/button'
import React, { useRef } from 'react'
import useImageUploadDialog from '../hooks/useImageUploadDialog'
import CoverImage from './CoverImage'

type Props = {
  title: string
  onEditUrl: (url: string) => void
  src?: string
}

const EditableCoverImage = ({ title, src, onEditUrl }: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const { getImageSrc } = useImageUploadDialog()

  const onEditImage = async () => {
    const newSrc = await getImageSrc({ title: 'Upload a cover photo' })
    if (newSrc) onEditUrl(newSrc)
  }

  return (
    <div className="relative flex items-center justify-center w-full mt-4 sm:mx-0">
      {src && <CoverImage title={title} src={src} />}
      {!src && (
        <div className="flex items-center justify-center w-full h-32 border-2 border-zinc-300 rounded-xl">
          No cover image
        </div>
      )}
      <div
        className="absolute top-0 left-0 z-10 flex w-full h-full cursor-pointer group"
        onClick={() => buttonRef?.current?.click()}
      >
        <Button
          className="invisible m-auto group-hover:visible"
          ref={buttonRef}
          onClick={onEditImage}
        >
          Upload new image
        </Button>
      </div>
    </div>
  )
}

export default EditableCoverImage
