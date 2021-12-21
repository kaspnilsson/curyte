import { DocumentTextIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { Button } from '@chakra-ui/react'
import { Lesson } from '../interfaces/lesson'
import { draftRoute, draftRouteHrefPath } from '../utils/routes'

type Props = {
  draft: Lesson
}

const DraftLink = ({ draft }: Props) => {
  return (
    <Link
      as={draftRoute(draft.uid)}
      href={draftRouteHrefPath}
      passHref
      key={draft.uid}
    >
      <Button
        variant="link"
        colorScheme="black"
        className="hover:bg-indigo-200 rounded overflow-hidden"
      >
        <span className="tracking-tight leading-tight w-auto flex items-center m-0 p-1">
          <DocumentTextIcon className="h-5 w-5 mr-1" />
          {draft.title || '(no title)'}
        </span>
      </Button>
    </Link>
  )
}
export default DraftLink
