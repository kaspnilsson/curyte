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
        className="overflow-hidden rounded hover:bg-zinc-100"
      >
        <span className="flex items-center w-auto p-1 pr-2 m-0 leading-tight tracking-tight">
          <DocumentTextIcon className="w-5 h-5 mr-1" />
          {draft.title || '(no title)'}
        </span>
      </Button>
    </Link>
  )
}
export default DraftLink
