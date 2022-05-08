import { DocumentTextIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { Button } from '@chakra-ui/react'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'
import { Lesson } from '@prisma/client'

interface Props {
  lesson: Lesson
}

const LessonLink = ({ lesson }: Props) => {
  return (
    <Link
      as={lessonRoute(lesson.uid)}
      href={lessonRouteHrefPath}
      passHref
      key={lesson.uid}
    >
      <a>
        <Button
          variant="link"
          colorScheme="black"
          className="max-w-full overflow-hidden rounded hover:bg-zinc-200 text-ellipsis whitespace-nowrap"
        >
          <span className="flex items-center w-auto p-1 m-0 overflow-hidden leading-tight tracking-tighter text-inherit text-ellipsis whitespace-nowrap">
            <DocumentTextIcon className="flex-shrink-0 w-5 h-5 mr-1" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {lesson.title || '(no title)'}
            </span>
          </span>
        </Button>
      </a>
    </Link>
  )
}
export default LessonLink
