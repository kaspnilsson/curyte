import { useContext } from 'react'
import {
  FileUploadDialogContext,
  FileUploadDialogProps,
} from '../components/dialogs/FileUploadDialog/FileUploadDialogContext'

const useFileUploadDialog = () => {
  const { openFileUploadDialog } = useContext(FileUploadDialogContext)

  const getFileSrc = (cfg: Partial<FileUploadDialogProps>): Promise<string> =>
    new Promise((res) => {
      openFileUploadDialog({
        ...cfg,
        actionCallback: res,
      })
    })

  return { getFileSrc }
}

export default useFileUploadDialog
