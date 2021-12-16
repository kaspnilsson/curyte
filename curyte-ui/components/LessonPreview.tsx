import Link from 'next/link'
import Image from 'next/image'
import { Lesson } from '../interfaces/lesson'
import React from 'react'
import { Heading } from '@chakra-ui/react'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'
import TagChip from './TagChip'
import { BookmarkIcon, EyeIcon } from '@heroicons/react/solid'
import { Author } from '../interfaces/author'
import AuthorLink from './AuthorLink'

type Props = {
  lesson: Lesson
  author?: Author | null
}

const LessonPreview = ({ lesson, author }: Props) => {
  return (
    <Link as={lessonRoute(lesson.uid)} href={lessonRouteHrefPath} passHref>
      <div className="group flex flex-col cursor-pointer rounded-xl shadow-lg overflow-hidden w-96 border-2 border-gray-200">
        <div className="flex flex-col gap-2 p-4">
          <Heading
            fontSize="lg"
            className="font-bold tracking-tight md:tracking-tighter leading-tight"
          >
            <a className="hover:underline group-hover:underline">
              {lesson.title || '(no title)'}
            </a>
          </Heading>
          <p className="text-sm leading-relaxed truncate min-w-0 text-gray-500">
            {lesson.description}
          </p>
          {lesson.tags?.length && (
            <div className="flex gap-2 items-center">
              {lesson.tags.slice(0, 3).map((t, index) => (
                <TagChip tagLabel={t} key={t + index} />
              ))}
            </div>
          )}
        </div>
        <div className="w-96 h-48 relative overflow-hidden">
          {lesson.coverImageUrl && (
            <Image
              src={lesson.coverImageUrl}
              layout="fill"
              objectFit="cover"
              alt={`Cover Image for ${lesson.title}`}
              className="image-wrapper"
            />
          )}
          {!lesson.coverImageUrl && (
            <div
              className="h-full w-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,1) 60%, rgba(233,216,253,1) 100%)',
              }}
            >
              <Image
                src="/static/curyte_logo_black.svg"
                layout="fill"
                objectFit="contain"
                alt={`Cover Image for ${lesson.title}`}
                className="image-wrapper"
              />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 p-4 flex flex-col gap-2">
          <div className="text-sm flex items-center justify-between">
            <div className="font-bold mr-4">
              {!author && lesson.authorName}
              {author && <AuthorLink author={author} />}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <BookmarkIcon className="h-6 w-6 text-inherit text-purple-500" />
                <Heading
                  fontSize="sm"
                  className="text-gray-500 tracking-tight md:tracking-tighter leading-tight"
                >
                  {lesson.saveCount || 0}
                </Heading>
              </div>
              <div className="flex flex-col items-center">
                <EyeIcon className="h-6 w-6 text-inherit text-purple-500" />
                <Heading
                  fontSize="sm"
                  className="text-gray-500 tracking-tight md:tracking-tighter leading-tight"
                >
                  {lesson.viewCount || 0}
                </Heading>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default LessonPreview
