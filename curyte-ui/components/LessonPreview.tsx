import Link from 'next/link'
import { Lesson } from '../interfaces/lesson'
import React from 'react'
import DateFormatter from './DateFormatter'
import { Center, Divider } from '@chakra-ui/react'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'

type Props = {
  lesson: Lesson
}

const LessonPreview = ({ lesson }: Props) => {
  return (
    <div>
      <div className="mb-5">
        {/* <CoverImage slug={slug} title={title} src={coverImage} /> */}
      </div>
      <h3 className="text-xl mb-3 leading-snug">
        <Link as={lessonRoute(lesson.uid)} href={lessonRouteHrefPath}>
          <a className="hover:underline">{lesson.title || '(no title)'}</a>
        </Link>
      </h3>
      <div className="text-sm mb-4 flex items-center">
        <div className="font-bold mr-4">{lesson.authorName}</div>
        {lesson.created && <DateFormatter dateString={lesson.created} />}
        {lesson.viewCount && (
          <>
            <Center className="h-4 w-6">
              <Divider orientation="vertical" />
            </Center>
            {`${lesson.viewCount} views`}
          </>
        )}
      </div>
      <p className="text-md leading-relaxed mb-4">{lesson.description}</p>
    </div>
  )
}

export default LessonPreview
