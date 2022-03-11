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

export const uploadFile = async (
  file: File,
  onProgress: (p: number) => void,
  onSuccess: (url: string) => void,
  onError: (e: unknown) => void
) => {
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
}

export const compressAndUploadImage = async (
  f: File,
  onProgress: (p: number) => void,
  onSuccess: (url: string) => void,
  onError: (e: unknown) => void
) => {
  f = await compressImage(f)
  await uploadFile(f, onProgress, onSuccess, onError)
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
