import {
  getDownloadURL,
  ref,
  StorageError,
  uploadBytesResumable,
} from 'firebase/storage'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { storage } from '../firebase/clientApp'

const useFirebaseStorage = (file: File) => {
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<StorageError | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const storageRef = ref(storage, uuidv4())

    uploadBytesResumable(storageRef, file).on(
      'state_changed',
      (snap) => {
        const percentage = (snap.bytesTransferred / snap.totalBytes) * 100
        setProgress(percentage)
      },
      (err) => {
        setError(err)
      },
      async () => {
        setUrl(await getDownloadURL(storageRef))
      }
    )
  }, [file])

  return { progress, url, error }
}

export default useFirebaseStorage
