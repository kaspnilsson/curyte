import { DocumentTextIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { Button } from '@chakra-ui/react'
import { Lesson } from '../interfaces/lesson'
import { lessonRoute, lessonRouteHrefPath } from '../utils/routes'

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
      <Button
        variant="link"
        colorScheme="black"
        className="overflow-hidden rounded hover:bg-zinc-200"
      >
        <span className="flex items-center w-auto p-1 m-0 leading-tight tracking-tight text-inherit">
          <DocumentTextIcon className="w-5 h-5 mr-1" />
          {lesson.title || '(no title)'}
        </span>
      </Button>
    </Link>
  )
}
export default LessonLink
