import Link from 'next/link'
import { LessonStorageModel } from '../interfaces/lesson'
import React from 'react'
import DateFormatter from './DateFormatter'

type Props = {
  lesson: LessonStorageModel
}

const LessonPreview = ({ lesson }: Props) => {
  return (
    <div>
      <div className="mb-5">
        {/* <CoverImage slug={slug} title={title} src={coverImage} /> */}
      </div>
      <h3 className="text-xl mb-3 leading-snug">
        <Link as={`/lessons/${lesson.uid}`} href="/lessons/[id]">
          <a className="hover:underline">{lesson.title || '(no title)'}</a>
        </Link>
      </h3>
      <div className="text-sm mb-4 flex">
        <div className="font-bold mr-4">{lesson.authorName}</div>
        {lesson.created && <DateFormatter dateString={lesson.created} />}
      </div>
      <p className="text-md leading-relaxed mb-4">{lesson.description}</p>
    </div>
  )
}

export default LessonPreview
