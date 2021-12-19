import { Button } from '@chakra-ui/button'
import React, { useRef, useState } from 'react'
import CoverImage from './CoverImage'
import ImageUploadDialog from './ImageUploadDialog'

type Props = {
  title: string
  onEditUrl: (url: string) => void
  src?: string
}

const EditableCoverImage = ({ title, src, onEditUrl }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <div className="sm:mx-0 relative w-full flex items-center justify-center mt-2">
      {src && <CoverImage title={title} src={src} />}
      {!src && (
        <div className="bg-slate-50 h-32 w-full rounded-xl flex items-center justify-center">
          No cover image
        </div>
      )}
      <div
        className="absolute top-0 left-0 z-10 flex w-full h-full group cursor-pointer"
        onClick={() => buttonRef?.current?.click()}
      >
        <Button
          className="m-auto invisible group-hover:visible"
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
        >
          Upload new image
        </Button>
      </div>
      <ImageUploadDialog
        title="Upload a cover photo"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={(src) => {
          setIsOpen(false)
          onEditUrl(src)
        }}
      />
    </div>
  )
}

export default EditableCoverImage
