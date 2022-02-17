import { useState, useEffect } from 'react'
import { compressAndUploadImage } from '../utils/upload-image'

const useSupabaseStorage = (file: File) => {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    compressAndUploadImage(
      file,
      setProgress,
      setUrl,
      (e) => setError(e as Error),
      true
    )
  }, [file])

  return { progress, url, error }
}

export default useSupabaseStorage
