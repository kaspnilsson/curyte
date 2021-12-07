import Link from 'next/link'
import { Lesson } from '../interfaces/lesson'
import React from 'react'
import DateFormatter from './DateFormatter'
import { Center, Divider } from '@chakra-ui/react'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'
import TagChip from './TagChip'
import CoverImage from './CoverImage'

type Props = {
  lesson: Lesson
}

const LessonPreview = ({ lesson }: Props) => {
  return (
    <div className="group">
      {lesson.coverImageUrl && (
        <div className="mb-5">
          <CoverImage
            lessonId={lesson.uid}
            title={lesson.title}
            src={lesson.coverImageUrl}
          />
        </div>
      )}
      <h3 className="text-xl mb-3 leading-snug">
        <Link as={lessonRoute(lesson.uid)} href={lessonRouteHrefPath}>
          <a className="hover:underline group-hover:underline">
            {lesson.title || '(no title)'}
          </a>
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
      {lesson.tags?.length && (
        <div className="flex gap-2 flex-wrap items-center mt-2">
          {lesson.tags.map((t) => (
            <TagChip tagLabel={t} key={t} />
          ))}
        </div>
      )}
    </div>
  )
}

export default LessonPreview
