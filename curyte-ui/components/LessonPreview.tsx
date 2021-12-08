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
    <div className="group flex">
      <div className="flex-1  min-w-0 mr-4">
        <h3 className="text-xl mb-3 leading-snug truncate min-w-0">
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
        <p className="text-md leading-relaxed mb-4 truncate min-w-0">
          {lesson.description}
        </p>
        {lesson.tags?.length && (
          <div className="flex gap-2 flex-wrap items-center mt-2">
            {lesson.tags.map((t, index) => (
              <TagChip tagLabel={t} key={t + index} />
            ))}
          </div>
        )}
      </div>
      {lesson.coverImageUrl && (
        <div className="flex-0 h-36 w-36">
          <CoverImage
            lessonId={lesson.uid}
            title={lesson.title}
            src={lesson.coverImageUrl}
            width={200}
            height={200}
          />
        </div>
      )}
    </div>
  )
}

export default LessonPreview
