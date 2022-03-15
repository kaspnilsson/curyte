import { ReactNode, useEffect, useRef, useState } from 'react'
import useWindowSize from '../hooks/useWindowSize'

interface Props {
  children: ReactNode
}

const OFFSET_PX = 16

const ClipYContainer = ({ children }: Props) => {
  const [maxHeight, setMaxHeight] = useState(9999)
  const ref = useRef<HTMLDivElement>(null)
  const { height } = useWindowSize()

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current)
      const { top } = ref.current.getBoundingClientRect()
      console.log('top: ', top)
      console.log('height: ', height)
      console.log('maxHeight: ', height - top - OFFSET_PX)
      setMaxHeight(height - top - OFFSET_PX)
      // Max height of element is the viewport height minus the Y coord of the current element
    }
  }, [ref, height])

  console.log('applied maxHeight: ', maxHeight)
  return (
    <div className="w-full pb-4" style={{ maxHeight }} ref={ref}>
      {children}
    </div>
  )
}

export default ClipYContainer
