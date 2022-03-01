import React, { useEffect } from 'react'
import useSupabaseStorage from '../hooks/useSupabaseStorage'
import { Progress } from '@chakra-ui/progress'
interface Props {
  file: File
  onSuccess: (url: string) => void
  onError: (msg: string) => void
  shouldCompress?: boolean
}

const UploadProgressBar = ({
  file,
  onSuccess,
  onError,
  shouldCompress = false,
}: Props) => {
  const { progress, url, error } = useSupabaseStorage(file, shouldCompress)

  useEffect(() => {
    if (url) {
      onSuccess(url)
    } else if (error) {
      onError(error.message)
    }
  }, [url, error, onSuccess, onError])

  return (
    <Progress
      isAnimated
      hasStripe
      value={progress}
      colorScheme="black"
      className="w-full"
    />
  )
}

export default UploadProgressBar
