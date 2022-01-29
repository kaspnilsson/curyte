import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  className?: string
}

const Container = ({ children, className = '' }: Props) => {
  return (
    <div
      className={`container mx-auto max-w-[1440px] px-4 md:px-8 ${className}`}
    >
      {children}
    </div>
  )
}

export default Container
