import { DocumentTextIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { Button } from '@chakra-ui/react'
import { LessonStorageModel } from '../interfaces/lesson'

type Props = {
  lesson: LessonStorageModel
}

const LessonLink = ({ lesson }: Props) => {
  return (
    <Link
      as={`/lessons/${lesson.uid}`}
      href="/lessons/[id]"
      passHref
      key={lesson.uid}
    >
      <Button variant="link" colorScheme="black">
        <h3 className="text-xl leading-snug w-auto flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          {lesson.title || '(no title)'}
        </h3>
      </Button>
    </Link>
  )
}
export default LessonLink
