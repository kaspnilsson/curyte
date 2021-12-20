import { useContext } from 'react'
import {
  ImageUploadDialogContext,
  ImageUploadDialogProps,
} from '../components/dialogs/ImageUploadDialog/ImageUploadDialogContext'

const useImageUploadDialog = () => {
  const { openImageUploadDialog } = useContext(ImageUploadDialogContext)

  const getImageSrc = (cfg: Partial<ImageUploadDialogProps>): Promise<string> =>
    new Promise((res) => {
      openImageUploadDialog({
        ...cfg,
        actionCallback: res,
      })
    })

  return { getImageSrc }
}

export default useImageUploadDialog
