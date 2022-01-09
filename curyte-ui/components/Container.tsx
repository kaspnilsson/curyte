import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  className?: string
}

const Container = ({ children, className = '' }: Props) => {
  return (
    <div className={`container mx-auto max-w-[1200px] px-4 ${className}`}>
      {children}
    </div>
  )
}

export default Container
