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
        className="hover:bg-purple-50 rounded overflow-hidden"
      >
        <span className="text-inherit tracking-tight leading-tight w-auto flex items-center m-0 p-1">
          <DocumentTextIcon className="h-5 w-5 mr-1" />
          {lesson.title || '(no title)'}
        </span>
      </Button>
    </Link>
  )
}
export default LessonLink
