import { createContext, ReactNode, useState } from 'react'
import FileUploadDialog from './FileUploadDialog'

export const FileUploadDialogContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  openFileUploadDialog: (args: FileUploadDialogProps) => {
    console.log(args)
  },
})

export interface FileUploadDialogProps {
  title?: string
  description?: string | ReactNode
  actionCallback: (src: string) => void
}

export const FileUploadDialogProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogConfig, setDialogConfig] =
    useState<FileUploadDialogProps | null>(null)

  const openFileUploadDialog = (cfg: FileUploadDialogProps) => {
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
    <FileUploadDialogContext.Provider value={{ openFileUploadDialog }}>
      <FileUploadDialog
        title={dialogConfig?.title || ''}
        description={dialogConfig?.description || ''}
        onSuccess={onSuccess}
        onClose={onClose}
        isOpen={isOpen}
      />
      {children}
    </FileUploadDialogContext.Provider>
  )
}
