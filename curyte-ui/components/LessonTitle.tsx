import React from 'react'

type Props = {
  title: string
}

export const computeClassesForTitle = (title?: string): string => {
  if ((title?.length || 0) < 25) return 'text-6xl'
  if ((title?.length || 0) < 70) return 'text-5xl'
  return 'text-4xl'
}

const LessonTitle = ({ title }: Props) => {
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
