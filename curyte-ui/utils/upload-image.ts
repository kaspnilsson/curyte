import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../firebase/clientApp'
import supabase from '../supabase/client'
import { uuid } from './uuid'

const compressOptions = {
  // As the key specify the maximum size
  // Leave blank for infinity
  maxSizeMB: 1.5,
  // Use webworker for faster compression with
  // the help of threads
  useWebWorker: true,
}

const SUPABASE_STORAGE_BUCKET_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`

export const uploadImage = async (
  file: File,
  onProgress: (p: number) => void,
  onSuccess: (url: string) => void,
  onError: (e: unknown) => void,
  useSupabase = false
) => {
  if (useSupabase) {
    const { data, error } = await supabase.storage
      .from('public-bucket')
      .upload(uuid(), file, { cacheControl: '31536000' })
    if (error) {
      onError(error)
      return
    }
    if (!data) {
      onError('Upload failed!')
      return
    }
    onSuccess(`${SUPABASE_STORAGE_BUCKET_URL}${data.Key}`)
  } else {
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
}

export const compressAndUploadImage = async (
  f: File,
  onProgress: (p: number) => void,
  onSuccess: (url: string) => void,
  onError: (e: unknown) => void,
  useSupabase = false
) => {
  f = await compressImage(f)
  await uploadImage(f, onProgress, onSuccess, onError, useSupabase)
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
