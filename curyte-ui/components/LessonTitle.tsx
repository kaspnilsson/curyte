import React, { ReactNode } from 'react'

type Props = {
  title: string
  isDraft?: boolean
}

export const computeClassesForTitle = (title: string): string => {
  if (title.length < 25) return 'text-6xl'
  if (title.length < 70) return 'text-5xl'
  return 'text-4xl'
}

const LessonTitle = ({ title, isDraft }: Props) => {
  return (
    <div className="mb-4">
      <h1
        className={`${computeClassesForTitle(
          title
        )} font-bold tracking-tighter leading-tight md:leading-none text-center md:text-left`}
      >
        {title}
      </h1>
    </div>
  )
}

export default LessonTitle
