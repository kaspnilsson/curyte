import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Badge, Center, Divider, Text } from '@chakra-ui/react'
import {
  editLessonRoute,
  editLessonRouteHrefPath,
  lessonInPathRoute,
  lessonInPathRouteHrefPath,
  lessonRoute,
  lessonRouteHrefPath,
} from '../utils/routes'
import TagChip from './TagChip'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import { DocumentTextIcon } from '@heroicons/react/outline'
import { Lesson } from '@prisma/client'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'

type Props = {
  lesson?: LessonWithProfile
  onClick?: (l: Lesson) => void
  pathId?: string
  noCover?: boolean
}

const LessonPreview = ({ lesson, onClick, pathId, noCover = false }: Props) => {
  if (!lesson) return null
  const card = (
    <div className="grid grid-cols-[1fr_min-content] w-full gap-3 cursor-pointer group lesson-preview py-6">
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex flex-col gap-2">
          <Text className="text-base font-bold leading-tight tracking-tighter line-clamp-2 md:text-2xl">
            <a className="hover:underline group-hover:underline">
              {lesson.title || '(no title)'}
            </a>
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:pt-2">
          {lesson.profiles && <AuthorLink author={lesson.profiles} small />}
          {lesson.created && (
            <>
              <Center className="w-2 h-2">
                <Divider orientation="vertical" />
              </Center>
              <div className="text-zinc-500">
                <DateFormatter date={lesson.created} />
              </div>
            </>
          )}
          <div className="items-center hidden gap-2 md:flex">
            <Center className="w-2 h-2">
              <Divider orientation="vertical" />
            </Center>
            <Text
              fontSize="xs"
              className="leading-tight tracking-tighter text-zinc-500 proportional-nums"
            >
              {lesson.saveCount || 0}
              &nbsp;{lesson.saveCount === 1 ? 'save' : 'saves'}
            </Text>
            <Center className="w-2 h-2">
              <Divider orientation="vertical" />
            </Center>
            <Text
              fontSize="xs"
              className="leading-tight tracking-tighter text-zinc-500 proportional-nums"
            >
              {lesson.viewCount || 0}
              &nbsp;{lesson.viewCount === 1 ? 'view' : 'views'}
            </Text>
          </div>
        </div>
        <div className="hidden mt-1 sm:mt-2 xs:inline">
          <Text
            className="line-clamp-1 md:line-clamp-2 text-zinc-700"
            fontSize="sm"
          >
            {lesson.description}
          </Text>
        </div>
        {!!lesson.tags?.length && (
          <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-2">
            {lesson.tags.slice(0, 3).map((t, index) => (
              <TagChip tagLabel={t} key={t + index} />
            ))}
          </div>
        )}
      </div>
      {!noCover && (
        <div className="relative w-32 h-32 overflow-hidden border rounded md:w-40 md:h-40 xl:w-72">
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
                  'radial-gradient(circle, rgba(255,255,255,1) 20%, rgba(200,200,200,1) 100%)',
              }}
            >
              <DocumentTextIcon className="w-full h-full p-6" />
            </div>
          )}

          <div className="absolute flex flex-col items-end gap-1 bottom-2 right-2 h-min">
            {lesson.featured && (
              <Badge
                variant="subtle"
                colorScheme="green"
                className="h-min w-min"
              >
                Featured
              </Badge>
            )}
            {lesson.private && (
              <Badge
                variant="subtle"
                colorScheme="orange"
                className="h-min w-min"
              >
                Private
              </Badge>
            )}
            <Badge variant="subtle" colorScheme="zinc" className="h-min w-min">
              <div className="flex items-center gap-1">
                Lesson
                <DocumentTextIcon className="w-3 h-3" />
              </div>
            </Badge>
          </div>
        </div>
      )}
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
            <>
              {!lesson.private && (
                <Link
                  as={lessonRoute(lesson.uid)}
                  href={lessonRouteHrefPath}
                  passHref
                >
                  {card}
                </Link>
              )}
              {lesson.private && (
                <Link
                  as={editLessonRoute(lesson.uid)}
                  href={editLessonRouteHrefPath}
                  passHref
                >
                  {card}
                </Link>
              )}
            </>
          )}
        </>
      )}
      {onClick && (
        <div className="w-full" onClick={() => onClick(lesson)}>
          {card}
        </div>
      )}
    </>
  )
}

export default LessonPreview
