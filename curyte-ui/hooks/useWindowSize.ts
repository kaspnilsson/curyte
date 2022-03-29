import { useState, useEffect } from 'react'

export const isServerSideRendering = typeof window === 'undefined'

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: isServerSideRendering ? 1200 : window.innerWidth,
    height: isServerSideRendering ? 800 : window.innerHeight,
  })

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }

  useEffect(() => {
    window.addEventListener('resize', changeWindowSize)

    setTimeout(changeWindowSize, 0)

    return () => {
      window.removeEventListener('resize', changeWindowSize)
    }
  }, [])

  return windowSize
}

export default useWindowSize
