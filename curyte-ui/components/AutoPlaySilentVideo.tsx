import React, { useRef, useEffect } from 'react'

interface Props {
  src: string
  type: string
  className?: string
}

export default function AutoPlaySilentVideo({
  src,
  type,
  className = '',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef?.current) videoRef.current.defaultMuted = true
  })
  return (
    <video
      className={className}
      ref={videoRef}
      loop={true}
      autoPlay={true}
      muted={true}
      playsInline
    >
      <source src={src} type={type} />
    </video>
  )
}
