import { useState, useEffect } from 'react'
import { compressAndUploadImage, uploadFile } from '../utils/upload-image'

const useSupabaseStorage = (file: File, shouldCompress: boolean) => {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (shouldCompress) {
      compressAndUploadImage(file, setProgress, setUrl, (e) =>
        setError(e as Error)
      )
    } else {
      uploadFile(file, setProgress, setUrl, (e) => setError(e as Error))
    }
  }, [file, shouldCompress])

  return { progress, url, error }
}

export default useSupabaseStorage
