import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import firebase from '../firebase/clientApp'

const useFirebaseStorage = (file: File) => {
  const [progress, setProgress] = useState(0)
  const [error, setError] =
    useState<firebase.storage.FirebaseStorageError | null>(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    const storageRef = firebase.storage().ref().child(uuidv4())

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

export default useFirebaseStorage
