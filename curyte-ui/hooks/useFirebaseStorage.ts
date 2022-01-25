import { StorageError } from 'firebase/storage'
import { useState, useEffect } from 'react'
import { uploadImage } from '../utils/upload-image'

const useFirebaseStorage = (file: File) => {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<StorageError | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    uploadImage(file, setProgress, setUrl, (e) => setError(e as StorageError))
  }, [file])

  return { progress, url, error }
}

export default useFirebaseStorage
