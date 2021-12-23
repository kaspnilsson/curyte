import Link from 'next/link'
import Image from 'next/image'
import { Lesson } from '../interfaces/lesson'
import React from 'react'
import { Text } from '@chakra-ui/react'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'
import TagChip from './TagChip'
import { BookmarkIcon, EyeIcon } from '@heroicons/react/outline'
import { Author } from '../interfaces/author'
import AuthorLink from './AuthorLink'

type Props = {
  lesson: Lesson
  author?: Author | null
}

const LessonPreview = ({ lesson, author }: Props) => {
  return (
    <Link as={lessonRoute(lesson.uid)} href={lessonRouteHrefPath} passHref>
      <div className="flex flex-col overflow-hidden border-2 shadow-lg cursor-pointer group rounded-xl w-80 border-zinc-200 lesson-preview">
        <div className="relative h-40 overflow-hidden w-80">
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
              className="w-full h-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,1) 60%, rgba(113,113,122,1) 100%)',
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
        <div className="flex flex-col gap-2 m-4">
          <Text
            fontSize="lg"
            className="font-bold leading-tight tracking-tight"
          >
            <a className="hover:underline group-hover:underline">
              {lesson.title || '(no title)'}
            </a>
          </Text>
          {!!lesson.tags?.length && (
            <div className="flex items-center gap-2">
              {lesson.tags.slice(0, 3).map((t, index) => (
                <TagChip tagLabel={t} key={t + index} />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-end flex-1 h-full min-w-0 gap-2 m-4 mt-0">
          <div className="flex items-center justify-between text-sm">
            <div className="mr-4 font-bold">
              {!author && lesson.authorName}
              {author && <AuthorLink author={author} />}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <BookmarkIcon className="w-5 h-5 text-zinc-500" />
                <Text
                  fontSize="sm"
                  className="leading-tight tracking-tight text-zinc-500 proportional-nums"
                >
                  {lesson.saveCount || 0}
                </Text>
              </div>
              <div className="flex flex-col items-center">
                <EyeIcon className="w-5 h-5 text-zinc-500" />
                <Text
                  fontSize="sm"
                  className="leading-tight tracking-tight text-zinc-500 proportional-nums"
                >
                  {lesson.viewCount || 0}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default LessonPreview
