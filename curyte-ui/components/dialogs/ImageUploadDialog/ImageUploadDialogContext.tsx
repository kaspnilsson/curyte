import { createContext, ReactNode, useState } from 'react'
import ImageUploadDialog from './ImageUploadDialog'

export const ImageUploadDialogContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  openImageUploadDialog: (args: ImageUploadDialogProps) => {
    console.log(args)
  },
})

export interface ImageUploadDialogProps {
  title?: string
  description?: string | ReactNode
  actionCallback: (src: string) => void
}

export const ImageUploadDialogProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogConfig, setDialogConfig] =
    useState<ImageUploadDialogProps | null>(null)

  const openImageUploadDialog = (cfg: ImageUploadDialogProps) => {
    setIsOpen(true)
    setDialogConfig(cfg)
  }

  const resetDialog = () => {
    setIsOpen(false)
    setDialogConfig(null)
  }

  const onSuccess = (src: string) => {
    resetDialog()
    dialogConfig?.actionCallback(src)
  }

  const onClose = () => {
    resetDialog()
    dialogConfig?.actionCallback('')
  }

  return (
    <ImageUploadDialogContext.Provider value={{ openImageUploadDialog }}>
      <ImageUploadDialog
        title={dialogConfig?.title || ''}
        description={dialogConfig?.description || ''}
        onSuccess={onSuccess}
        onClose={onClose}
        isOpen={isOpen}
      />
      {children}
    </ImageUploadDialogContext.Provider>
  )
}
