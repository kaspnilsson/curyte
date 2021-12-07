import { useState, useEffect } from 'react'
import firebase from '../firebase/clientApp'

const useStorage = (file: File) => {
  const [progress, setProgress] = useState(0)
  const [error, setError] =
    useState<firebase.storage.FirebaseStorageError | null>(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    const storageRef = firebase.storage().ref(file.name)

    storageRef.put(file).on(
      'state_changed',
      (snap) => {
        const percentage = (snap.bytesTransferred / snap.totalBytes) * 100
        setProgress(percentage)
      },
      (err) => {
        setError(err)
      },
      async () => {
        setUrl(await storageRef.getDownloadURL())
      }
    )
  }, [file])

  return { progress, url, error }
}

export default useStorage
