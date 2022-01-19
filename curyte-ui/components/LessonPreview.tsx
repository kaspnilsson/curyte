import Link from 'next/link'
import Image from 'next/image'
import { Lesson } from '../interfaces/lesson'
import React from 'react'
import { Center, Divider, Text } from '@chakra-ui/react'
import {
  lessonInPathRoute,
  lessonInPathRouteHrefPath,
  lessonRoute,
  lessonRouteHrefPath,
} from '../utils/routes'
import TagChip from './TagChip'
import { Author } from '../interfaces/author'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'

type Props = {
  lesson?: Lesson
  author?: Author | null
  onClick?: (l: Lesson) => void
  pathId?: string
}

const LessonPreview = ({ lesson, author, onClick, pathId }: Props) => {
  if (!lesson) return null
  const card = (
    <div className="flex items-center w-full gap-3 cursor-pointer group lesson-preview">
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex flex-col gap-2">
          <Text className="text-base font-bold leading-tight tracking-tight line-clamp-2 md:text-2xl">
            <a className="hover:underline group-hover:underline">
              {lesson.title || '(no title)'}
            </a>
          </Text>
        </div>
        {!!lesson.tags?.length && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {lesson.tags.slice(0, 3).map((t, index) => (
              <TagChip tagLabel={t} key={t + index} />
            ))}
          </div>
        )}
        <div className="hidden mt-2 md:inline">
          <Text className="line-clamp-2 text-zinc-500" fontSize="sm">
            {lesson.description}
          </Text>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          {!author && <div className="font-bold">{lesson.authorName}</div>}
          {author && <AuthorLink author={author} small />}
          <Center className="w-2 h-2">
            <Divider orientation="vertical" />
          </Center>
          <div className="text-zinc-500">
            <DateFormatter dateString={lesson.created} />
          </div>
          <div className="items-center hidden gap-2 md:flex">
            <Center className="w-2 h-2">
              <Divider orientation="vertical" />
            </Center>
            <Text
              fontSize="xs"
              className="leading-tight tracking-tight text-zinc-500 proportional-nums"
            >
              {lesson.saveCount || 0}
              &nbsp;{lesson.saveCount === 1 ? 'save' : 'saves'}
            </Text>
            <Center className="w-2 h-2">
              <Divider orientation="vertical" />
            </Center>
            <Text
              fontSize="xs"
              className="leading-tight tracking-tight text-zinc-500 proportional-nums"
            >
              {lesson.viewCount || 0}
              &nbsp;{lesson.viewCount === 1 ? 'view' : 'views'}
            </Text>
          </div>
        </div>
      </div>
      <div className="relative w-24 h-24 overflow-hidden rounded md:w-36 md:h-36 lg:w-64">
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
    </div>
  )
  return (
    <>
      {!onClick && (
        <>
          {pathId && (
            <Link
              as={lessonInPathRoute(pathId, lesson.uid)}
              href={lessonInPathRouteHrefPath}
              passHref
            >
              {card}
            </Link>
          )}
          {!pathId && (
            <Link
              as={lessonRoute(lesson.uid)}
              href={lessonRouteHrefPath}
              passHref
            >
              {card}
            </Link>
          )}
        </>
      )}
      {onClick && <div onClick={() => onClick(lesson)}>{card}</div>}
    </>
  )
}

export default LessonPreview
