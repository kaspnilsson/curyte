import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../firebase/clientApp'
import { uuid } from './uuid'

const compressOptions = {
  // As the key specify the maximum size
  // Leave blank for infinity
  maxSizeMB: 1.5,
  // Use webworker for faster compression with
  // the help of threads
  useWebWorker: true,
}

export const uploadImage = (
  file: File,
  onProgress: (p: number) => void,
  onSuccess: (url: string) => void,
  onError: (e: unknown) => void
) => {
  const storageRef = ref(storage, uuid())

  uploadBytesResumable(storageRef, file).on(
    'state_changed',
    (snap) => {
      const percentage = (snap.bytesTransferred / snap.totalBytes) * 100
      onProgress(percentage)
    },
    (err) => {
      onError(err)
    },
    async () => {
      onSuccess(await getDownloadURL(storageRef))
    }
  )
}

export const compressAndUploadImage = async (
  f: File,
  onProgress: (p: number) => void,
  onSuccess: (url: string) => void,
  onError: (e: unknown) => void
) => {
  f = await compressImage(f)
  uploadImage(f, onProgress, onSuccess, onError)
}

export const compressImage = async (f: File): Promise<File> => {
  if (f.type === 'image/gif') {
    // Compress library does not support gif
    return Promise.resolve(f)
  } else {
    const Compress = await import('browser-image-compression')
    const blob = await Compress.default(f, compressOptions)
    return new File([blob], f.name, {
      type: f.type,
      lastModified: Date.now(),
    })
  }
}
