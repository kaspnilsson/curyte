import React, { useEffect } from 'react'
import useStorage from '../hooks/useStorage'
import { Progress } from '@chakra-ui/progress'
interface Props {
  file: File
  onSuccess: (url: string) => void
  onError: (msg: string) => void
}

const UploadProgressBar = ({ file, onSuccess, onError }: Props) => {
  const { progress, url, error } = useStorage(file)

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
      colorScheme="purple"
      className="w-full"
    />
  )
}

export default UploadProgressBar
