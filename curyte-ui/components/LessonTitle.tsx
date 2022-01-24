import React from 'react'

type Props = {
  title: string
}

export const computeClassesForTitle = (title?: string): string => {
  if ((title?.length || 0) < 25) return 'text-4xl lg:text-6xl'
  if ((title?.length || 0) < 70) return 'text-3xl lg:text-5xl'
  return 'text-2xl lg:text-4xl'
}

const LessonTitle = ({ title }: Props) => {
  return (
    <div className="mb-4">
      <h1
        className={`${computeClassesForTitle(
          title
        )} font-bold tracking-tighter leading-tight md:leading-none text-left`}
      >
        {title || '(no title)'}
      </h1>
    </div>
  )
}

export default LessonTitle
